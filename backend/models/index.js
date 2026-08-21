const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);
db.Empresa = require("../models/empresa.model.js")(sequelize, Sequelize);
db.Cliente = require("../models/cliente.model.js")(sequelize, Sequelize);
db.Cobrador = require("../models/cobrador.model.js")(sequelize, Sequelize);
db.Plan = require("../models/plan.model.js")(sequelize, Sequelize);
db.Credito = require("../models/credito.model.js")(sequelize, Sequelize);
db.CreditoDetalle = require("../models/creditodetalle.model.js")(sequelize, Sequelize);
db.Caja = require("../models/caja.model.js")(sequelize, Sequelize);
db.Vale = require("../models/vale.model.js")(sequelize, Sequelize);
db.RendicionDiaria = require("../models/rendiciondiaria.model.js")(sequelize, Sequelize);
db.RendicionSemanal = require("../models/rendicionsemanal.model.js")(sequelize, Sequelize);
db.PagoCobradores = require("../models/pagocobradores.model.js")(sequelize, Sequelize);
db.NoLaborales = require("../models/nolaborales.model.js")(sequelize, Sequelize);
db.Gastos = require("../models/gasto.model.js")(sequelize, Sequelize);
db.Notificacion = require("../models/notificacion.model.js")(sequelize, Sequelize);



db.Empresa.hasOne(db.user, { foreignKey: 'idempresa', foreignKeyConstraint: true })
db.Empresa.hasOne(db.Cliente, { foreignKey: 'idempresa', foreignKeyConstraint: true })
db.Empresa.hasOne(db.Cobrador, { foreignKey: 'idempresa', foreignKeyConstraint: true })
db.Credito.hasMany(db.CreditoDetalle, {foreignKey:'idcredito', targetKey:'idcredito'}, { onDelete: 'cascade' })


db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "supervisor"];

module.exports = db;
