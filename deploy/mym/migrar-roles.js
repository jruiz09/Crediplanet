#!/usr/bin/env node
// Prepara la base para el módulo de Roles y Usuarios, igual que en Crediplanet.
// Se puede correr las veces que haga falta: solo agrega lo que falta.
//
// Uso: node migrar-roles.js <backend instalado> [--dry-run]
//   ASIGNAR_ADMIN=<usuario> le agrega el rol admin a ese usuario.
// Sale con código 1 si ningún usuario activo queda con rol admin.
const path = require("path");

const instalado = path.resolve(process.argv[2] || "");
const DRY_RUN = process.argv.includes("--dry-run");
const ASIGNAR_ADMIN = process.env.ASIGNAR_ADMIN;

const requerirInstalado = (modulo) => require(path.join(instalado, "node_modules", modulo));
requerirInstalado("dotenv").config({ path: path.join(instalado, ".env") });
const mysql = requerirInstalado("mysql2/promise");

const ROLES = ["user", "supervisor", "admin", "administrativo"];

const PANTALLAS = [
  ["HOME", "Inicio"],
  ["CLIENTES", "Clientes"],
  ["COBRADORES", "Cobradores"],
  ["PLANES", "Planes"],
  ["CREDITOS", "Creditos"],
  ["CAJA", "Caja"],
  ["RENDICION", "Rendicion"],
  ["PRODUCTIVIDAD", "Productividad"],
  ["PRODUCTIVIDAD_FECHAS", "Productividad por fechas"],
  ["PAGO_COBRADORES", "Pago Cobradores"],
  ["NO_LABORALES", "Dias no laborales"],
  ["CLIENTES_MOROSOS", "Clientes morosos"],
  ["INFORMES", "Informes"],
  ["GASTOS", "Gastos"],
  ["RESUMEN_CLIENTE", "Resumen cliente"],
  ["NOTIFICACIONES", "Notificaciones"],
  ["ROLES", "Roles"],
  ["PANTALLAS", "Pantallas"],
  ["USUARIOS", "Usuarios"],
];

const PERMISOS = {
  admin: PANTALLAS.map(([codigo]) => codigo),
  administrativo: PANTALLAS.map(([codigo]) => codigo).filter(
    (codigo) => !["INFORMES", "ROLES", "PANTALLAS", "USUARIOS"].includes(codigo)
  ),
};

(async () => {
  const conexion = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
  });
  const consultar = async (sql, params) => (await conexion.query(sql, params))[0];
  let cambios = 0;
  const ejecutar = async (descripcion, sql, params) => {
    cambios++;
    console.log((DRY_RUN ? "PENDIENTE  " : "HECHO      ") + descripcion);
    if (!DRY_RUN) await conexion.query(sql, params);
  };

  const existeTabla = async (tabla) =>
    (await consultar(
      "SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?",
      [tabla]
    )).length > 0;
  const columna = async (tabla, nombre) =>
    (await consultar(
      "SELECT EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
      [tabla, nombre]
    ))[0];

  console.log(`Base: ${process.env.MYSQL_DB_NAME} en ${process.env.MYSQL_HOST}${DRY_RUN ? " (dry-run)" : ""}`);

  // 1. Columnas nuevas (el login rechaza usuarios con activo = 0)
  for (const tabla of ["users", "cobradores"]) {
    if (!(await columna(tabla, "activo"))) {
      await ejecutar(
        `Columna ${tabla}.activo`,
        `ALTER TABLE ${tabla} ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1`
      );
    }
  }

  // 2. roles.id autoincremental, para poder crear roles desde la pantalla
  const idRoles = await columna("roles", "id");
  if (idRoles && !idRoles.EXTRA.includes("auto_increment")) {
    cambios++;
    console.log((DRY_RUN ? "PENDIENTE  " : "HECHO      ") + "roles.id autoincremental");
    if (!DRY_RUN) {
      await conexion.query("SET FOREIGN_KEY_CHECKS = 0");
      await conexion.query("ALTER TABLE roles MODIFY id INT NOT NULL AUTO_INCREMENT");
      await conexion.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  }

  // 3. Tablas de pantallas y permisos (mismo esquema que crea Sequelize)
  if (!(await existeTabla("pantallas"))) {
    await ejecutar(
      "Tabla pantallas",
      `CREATE TABLE pantallas (
         id INT NOT NULL AUTO_INCREMENT,
         codigo VARCHAR(255) NOT NULL UNIQUE,
         nombre VARCHAR(255) NOT NULL,
         app ENUM('adm', 'mobile') NOT NULL,
         activo TINYINT(1) NOT NULL DEFAULT 1,
         PRIMARY KEY (id)
       ) ENGINE = InnoDB`
    );
  }
  if (!(await existeTabla("rol_pantalla"))) {
    await ejecutar(
      "Tabla rol_pantalla",
      `CREATE TABLE rol_pantalla (
         createdAt DATETIME NOT NULL,
         updatedAt DATETIME NOT NULL,
         idrol INT NOT NULL,
         idpantalla INT NOT NULL,
         PRIMARY KEY (idrol, idpantalla),
         FOREIGN KEY (idrol) REFERENCES roles (id) ON DELETE CASCADE ON UPDATE CASCADE,
         FOREIGN KEY (idpantalla) REFERENCES pantallas (id) ON DELETE CASCADE ON UPDATE CASCADE
       ) ENGINE = InnoDB`
    );
  }

  // 4. Roles
  const rolesExistentes = (await consultar("SELECT name FROM roles")).map((r) => r.name);
  for (const rol of ROLES.filter((r) => !rolesExistentes.includes(r))) {
    await ejecutar(
      `Rol ${rol}`,
      "INSERT INTO roles (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())",
      [rol]
    );
  }

  // 5. Pantallas y permisos (si la tabla todavía no existe en dry-run, todo queda pendiente)
  const hayPantallas = await existeTabla("pantallas");
  const pantallasExistentes = hayPantallas
    ? (await consultar("SELECT codigo FROM pantallas")).map((p) => p.codigo)
    : [];
  for (const [codigo, nombre] of PANTALLAS.filter(([c]) => !pantallasExistentes.includes(c))) {
    await ejecutar(
      `Pantalla ${codigo}`,
      "INSERT INTO pantallas (codigo, nombre, app, activo) VALUES (?, ?, 'adm', 1)",
      [codigo, nombre]
    );
  }

  const permisosExistentes = (await existeTabla("rol_pantalla"))
    ? (await consultar(
        "SELECT r.name rol, p.codigo FROM rol_pantalla rp JOIN roles r ON r.id = rp.idrol JOIN pantallas p ON p.id = rp.idpantalla"
      )).map((p) => `${p.rol}/${p.codigo}`)
    : [];
  for (const [rol, codigos] of Object.entries(PERMISOS)) {
    const faltantes = codigos.filter((c) => !permisosExistentes.includes(`${rol}/${c}`));
    if (!faltantes.length) continue;
    await ejecutar(
      `Permisos de ${rol}: ${faltantes.length} pantallas`,
      `INSERT IGNORE INTO rol_pantalla (idrol, idpantalla, createdAt, updatedAt)
       SELECT r.id, p.id, NOW(), NOW() FROM roles r JOIN pantallas p
       WHERE r.name = ? AND p.codigo IN (?)`,
      [rol, faltantes]
    );
  }

  // 6. Admin opcional
  if (ASIGNAR_ADMIN) {
    const [usuario] = await consultar("SELECT id FROM users WHERE username = ?", [ASIGNAR_ADMIN]);
    if (!usuario) {
      console.log(`ERROR      No existe el usuario ${ASIGNAR_ADMIN}`);
      process.exitCode = 1;
    } else {
      await ejecutar(
        `Rol admin para ${ASIGNAR_ADMIN}`,
        `INSERT IGNORE INTO user_roles (roleId, userId, createdAt, updatedAt)
         SELECT id, ?, NOW(), NOW() FROM roles WHERE name = 'admin'`,
        [usuario.id]
      );
    }
  }

  if (!cambios) console.log("Nada para migrar: la base ya está al día.");

  // 7. Resumen de usuarios por rol
  const usuarios = await consultar(
    `SELECT u.username, COALESCE(GROUP_CONCAT(r.name ORDER BY r.name), '(sin rol)') roles
     FROM users u LEFT JOIN user_roles ur ON ur.userId = u.id LEFT JOIN roles r ON r.id = ur.roleId
     GROUP BY u.id, u.username ORDER BY u.username`
  );
  console.log("\nUsuarios y roles:");
  usuarios.forEach((u) => console.log(`  ${u.username}: ${u.roles}`));

  const hayAdmin = usuarios.some((u) => u.roles.split(",").includes("admin"));
  const adminPendiente = DRY_RUN && ASIGNAR_ADMIN;
  if (!hayAdmin && !adminPendiente) {
    console.log(
      "\nERROR      Ningún usuario tiene rol admin: nadie podría administrar usuarios ni roles." +
        "\n           Elegí uno y corré: ASIGNAR_ADMIN=<usuario> /opt/deploy-mym.sh"
    );
    process.exitCode = 1;
  }

  await conexion.end();
})().catch((error) => {
  console.error("Error en la migración:", error.message);
  process.exit(1);
});
