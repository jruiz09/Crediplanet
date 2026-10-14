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

4. En `/etc/nginx/sites-enabled/mymlanus`, dentro del `server` que escucha
   `443` para `mymlanus.com.ar`, junto al `location /api/`, agregar:

   ```nginx
   location /uploads/ {
       proxy_pass http://localhost:8080/uploads/;
   }
   ```

   Y aplicar: `nginx -t && systemctl reload nginx`

5. Probar sin cambiar nada y después deployar:

   ```bash
   /opt/deploy-mym.sh --dry-run
   /opt/deploy-mym.sh
   ```
