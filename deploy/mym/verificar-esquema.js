#!/usr/bin/env node
// Verifica que la base configurada en <backend instalado>/.env tenga lo que
// necesita el código del repo: tablas y columnas de los modelos de Sequelize
// y las vistas que usan los controllers.
//
// Uso: node verificar-esquema.js <backend del repo> <backend instalado>
// Sale con código 1 si falta alguna columna o vista.
const fs = require("fs");
const path = require("path");

const [repo, instalado] = process.argv.slice(2).map((p) => p && path.resolve(p));
if (!repo || !instalado) {
  console.error("Uso: node verificar-esquema.js <backend del repo> <backend instalado>");
  process.exit(2);
}

const requerirInstalado = (modulo) => require(path.join(instalado, "node_modules", modulo));
requerirInstalado("dotenv").config({ path: path.join(instalado, ".env") });
const Sequelize = requerirInstalado("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  { host: process.env.MYSQL_HOST, dialect: "mysql", logging: false }
);

// Solo los modelos que carga models/index.js
const indexModelos = fs.readFileSync(path.join(repo, "models", "index.js"), "utf8");
const archivosModelos = [
  ...new Set([...indexModelos.matchAll(/require\("\.\.\/models\/([^"]+)"\)/g)].map((m) => m[1])),
];

// Vistas usadas en SQL crudo
const vistas = new Set();
for (const archivo of fs.readdirSync(path.join(repo, "controllers"))) {
  if (!archivo.endsWith(".js") || archivo.startsWith("bkp")) continue;
  const codigo = fs.readFileSync(path.join(repo, "controllers", archivo), "utf8");
  for (const m of codigo.matchAll(/\b(vw_[a-z0-9_]+|resumengastosmes)\b/gi)) {
    vistas.add(m[1].toLowerCase());
  }
}

(async () => {
  const [tablas] = await sequelize.query(
    "SELECT LOWER(TABLE_NAME) nombre FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()"
  );
  const [columnas] = await sequelize.query(
    "SELECT LOWER(TABLE_NAME) tabla, LOWER(COLUMN_NAME) columna FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()"
  );
  const existentes = new Set(tablas.map((t) => t.nombre));
  const columnasPorTabla = {};
  for (const c of columnas) (columnasPorTabla[c.tabla] ??= new Set()).add(c.columna);

  const errores = [];
  const avisos = [];

  for (const archivo of archivosModelos) {
    const modelo = require(path.join(repo, "models", archivo))(sequelize, Sequelize);
    const tabla = String(modelo.getTableName()).toLowerCase();
    if (!existentes.has(tabla)) {
      avisos.push(`Falta la tabla ${tabla} (sequelize.sync() la crea al arrancar)`);
      continue;
    }
    for (const atributo of Object.values(modelo.rawAttributes)) {
      const columna = (atributo.field || atributo.fieldName).toLowerCase();
      if (!columnasPorTabla[tabla]?.has(columna)) {
        errores.push(`Falta la columna ${tabla}.${columna}`);
      }
    }
  }

  for (const vista of vistas) {
    if (!existentes.has(vista)) errores.push(`Falta la vista ${vista}`);
  }

  console.log(`Base: ${process.env.MYSQL_DB_NAME} en ${process.env.MYSQL_HOST}`);
  console.log(`Modelos revisados: ${archivosModelos.length} - Vistas revisadas: ${vistas.size}`);
  avisos.forEach((a) => console.log("AVISO  " + a));
  errores.forEach((e) => console.log("ERROR  " + e));
  if (!errores.length) console.log("OK: la base tiene todo lo que usa el código.");

  await sequelize.close();
  process.exit(errores.length ? 1 : 0);
})().catch((error) => {
  console.error("No se pudo verificar la base:", error.message);
  process.exit(1);
});
