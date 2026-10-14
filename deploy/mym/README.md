# Deploy de MyM (mymlanus.com.ar)

MyM corre el mismo código que Crediplanet, compilado con `build:mym` y con su
propio `backend/.env` (otra base). El servidor baja el repo a `/opt/repo` y
publica en las rutas que ya usa nginx:

| Parte    | Destino            | Cómo se actualiza                      |
|----------|--------------------|----------------------------------------|
| Backend  | `/opt/back`        | rsync del código + `pm2 restart server` |
| Web      | `/opt/front/dist`  | `npm run build:mym` en `frontend`      |
| Mobile   | `/opt/mobile/dist` | `npm run build:mym` en `landing`       |

Nunca se tocan `/opt/back/.env`, `/opt/back/uploads` ni `node_modules`.
Las fotos de clientes se sirven en `https://mymlanus.com.ar/api/uploads/`,
a través del mismo `location /api/` de nginx que usa la API.

## Deploy

```bash
/opt/deploy-mym.sh --dry-run   # qué cambiaría en el backend + verificación de la base
/opt/deploy-mym.sh             # deploy (hace backup antes)
```

Si algo sale mal: `/opt/repo/deploy/mym/rollback.sh` lista los backups y
`/opt/repo/deploy/mym/rollback.sh <fecha>` restaura uno.

El deploy se corta si a la base de MyM le falta alguna columna o vista que usa
el código. Las tablas que faltan no lo cortan: `sequelize.sync()` las crea al
arrancar.

## Roles y Usuarios

Antes de tocar el código, `migrar-roles.js` deja la base como la de
Crediplanet: columnas `users.activo` y `cobradores.activo`, tablas `pantallas`
y `rol_pantalla`, roles `user`, `supervisor`, `admin` y `administrativo`, las
19 pantallas y los permisos de `admin` (todas) y `administrativo` (todas menos
Informes, Roles, Pantallas y Usuarios). Solo agrega lo que falta y respalda
antes las tablas de usuarios en `/opt/backups/<fecha>/usuarios.sql`.

Cada usuario ve solo las pantallas de su rol. Si ningún usuario tiene rol
`admin`, el deploy se corta; para darle admin a alguien:

```bash
ASIGNAR_ADMIN=<usuario> /opt/deploy-mym.sh
```

Los demás roles se asignan después desde la pantalla Usuarios.

## Primera vez (como root)

1. Cortar el servidor de desarrollo que quedó corriendo:

   ```bash
   pkill -f "/opt/front/node_modules/.bin/vite"
   ```

2. Bajar el repo y dejar el comando a mano:

   ```bash
   git clone https://github.com/jruiz09/Crediplanet.git /opt/repo
   chmod +x /opt/repo/deploy/mym/*.sh
   ln -s /opt/repo/deploy/mym/deploy.sh /opt/deploy-mym.sh
   ```

3. Agregar al final de `/opt/back/.env`:

   ```
   CORS_ORIGIN=https://mymlanus.com.ar
   APP_NOMBRE=mym
   ```

4. Probar sin cambiar nada y después deployar:

   ```bash
   /opt/deploy-mym.sh --dry-run
   /opt/deploy-mym.sh
   ```
