#!/usr/bin/env bash
# Vuelve MyM al estado de un backup hecho por deploy.sh.
#   /opt/repo/deploy/mym/rollback.sh             lista los backups
#   /opt/repo/deploy/mym/rollback.sh <fecha>     restaura ese backup
set -euo pipefail

BACKUPS="/opt/backups"
BACK_DIR="/opt/back"
FRONT_DIST="/opt/front/dist"
MOBILE_DIST="/opt/mobile/dist"
PM2_BACKEND="server"

if [[ -z "${1:-}" ]]; then
  echo "Backups disponibles:"; ls -1t "$BACKUPS"
  exit 0
fi

ORIGEN="$BACKUPS/$1"
[[ -d "$ORIGEN" ]] || { echo "No existe $ORIGEN"; exit 1; }

echo "Restaurando $ORIGEN"
tar -xzf "$ORIGEN/back.tgz" -C "$BACK_DIR"
rsync -a --delete "$ORIGEN/front-dist/" "$FRONT_DIST/"
rsync -a --delete "$ORIGEN/mobile-dist/" "$MOBILE_DIST/"
cd "$BACK_DIR" && npm install --omit=dev --no-audit --no-fund
pm2 restart "$PM2_BACKEND" --update-env
echo "Listo."
