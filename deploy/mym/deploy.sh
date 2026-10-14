#!/usr/bin/env bash
# Deploy de MyM (mymlanus.com.ar) desde el repo de Crediplanet.
#
#   /opt/deploy-mym.sh --dry-run   muestra qué cambiaría en el backend y verifica la base
#   /opt/deploy-mym.sh             hace el deploy
#
# Variables opcionales: RAMA (default main), FORZAR=1 (deploya aunque falten columnas/vistas)
set -euo pipefail

REPO_URL="https://github.com/jruiz09/Crediplanet.git"
REPO_DIR="/opt/repo"
RAMA="${RAMA:-main}"
BACK_DIR="/opt/back"
FRONT_DIST="/opt/front/dist"
MOBILE_DIST="/opt/mobile/dist"
PM2_BACKEND="server"
BACKUPS="/opt/backups"
URL_CHEQUEO="https://mymlanus.com.ar/api/plan"

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

paso() { echo; echo "==> $*"; }

for comando in git rsync npm node pm2 curl; do
  command -v "$comando" >/dev/null || { echo "Falta '$comando' en el servidor"; exit 1; }
done

paso "Bajando $RAMA de $REPO_URL"
if [[ ! -d "$REPO_DIR/.git" ]]; then
  git clone --branch "$RAMA" "$REPO_URL" "$REPO_DIR"
else
  git -C "$REPO_DIR" fetch --quiet origin "$RAMA"
  git -C "$REPO_DIR" checkout --quiet "$RAMA"
  git -C "$REPO_DIR" reset --quiet --hard "origin/$RAMA"
fi
git -C "$REPO_DIR" log --oneline -1

# Nunca se tocan: configuración, fotos, dependencias ni el .git del clon viejo
RSYNC_BACK=(rsync -a --itemize-changes
  --exclude=.git --exclude=node_modules --exclude=uploads
  --exclude=.env --exclude=.env.example)

paso "Verificando la base de MyM contra el código"
if ! node "$REPO_DIR/deploy/mym/verificar-esquema.js" "$REPO_DIR/backend" "$BACK_DIR"; then
  if [[ "$DRY_RUN" == 1 || "${FORZAR:-0}" != 1 ]]; then
    echo "La base no tiene todo lo que usa el código. Revisá los ERROR de arriba."
    [[ "$DRY_RUN" == 1 ]] || { echo "Para deployar igual: FORZAR=1 $0"; exit 1; }
  fi
fi

if [[ "$DRY_RUN" == 1 ]]; then
  paso "Archivos del backend que cambiarían (no se aplica nada)"
  "${RSYNC_BACK[@]}" --dry-run "$REPO_DIR/backend/" "$BACK_DIR/"
  echo; echo "Dry-run terminado. Para deployar: $0"
  exit 0
fi

FECHA="$(date +%Y%m%d-%H%M%S)"
paso "Backup en $BACKUPS/$FECHA"
mkdir -p "$BACKUPS/$FECHA"
tar -czf "$BACKUPS/$FECHA/back.tgz" -C "$BACK_DIR" --exclude=node_modules --exclude=uploads .
cp -a "$FRONT_DIST" "$BACKUPS/$FECHA/front-dist"
cp -a "$MOBILE_DIST" "$BACKUPS/$FECHA/mobile-dist"
# Se conservan los últimos 5 backups
ls -1dt "$BACKUPS"/*/ | tail -n +6 | xargs -r rm -rf

paso "Compilando frontend web (MyM)"
cd "$REPO_DIR/frontend"
npm ci --no-audit --no-fund
npm run build:mym

paso "Compilando mobile (MyM)"
cd "$REPO_DIR/landing"
npm ci --no-audit --no-fund
npm run build:mym

paso "Actualizando backend"
"${RSYNC_BACK[@]}" "$REPO_DIR/backend/" "$BACK_DIR/"
cd "$BACK_DIR"
npm install --omit=dev --no-audit --no-fund

paso "Publicando frontend y mobile"
rsync -a --delete "$REPO_DIR/frontend/dist/" "$FRONT_DIST/"
rsync -a --delete "$REPO_DIR/landing/dist/" "$MOBILE_DIST/"

paso "Reiniciando backend (pm2: $PM2_BACKEND)"
pm2 restart "$PM2_BACKEND" --update-env
sleep 5

paso "Chequeo"
CODIGO="$(curl -s -o /dev/null -w '%{http_code}' "$URL_CHEQUEO")"
if [[ "$CODIGO" == "403" ]]; then
  echo "OK: la API responde ($URL_CHEQUEO -> 403 sin token)"
else
  echo "ATENCIÓN: $URL_CHEQUEO respondió $CODIGO (se esperaba 403)."
  echo "Revisá: pm2 logs $PM2_BACKEND --lines 50"
  echo "Para volver atrás: $REPO_DIR/deploy/mym/rollback.sh $FECHA"
  exit 1
fi

echo; echo "Deploy terminado ($(git -C "$REPO_DIR" log --oneline -1)). Backup: $BACKUPS/$FECHA"
