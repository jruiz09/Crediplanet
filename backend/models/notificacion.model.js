module.exports = (sequelize, Sequelize) => {
  const Notificacion = sequelize.define("notificacion", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    idcredito: { type: Sequelize.INTEGER, allowNull: false },
    idcreditodetalle: { type: Sequelize.INTEGER, allowNull: false },
    cliente: { type: Sequelize.STRING, allowNull: false },
    idcobrador: { type: Sequelize.INTEGER, allowNull: false },
    cuota: { type: Sequelize.INTEGER, allowNull: false },
    monto: { type: Sequelize.INTEGER, allowNull: false },
    tipo: { type: Sequelize.STRING, allowNull: false },
    cobrador: { type: Sequelize.STRING, allowNull: false },
    fecha: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    leida: { type: Sequelize.BOOLEAN, defaultValue: false },
    latitud: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    longitud: {
      type: Sequelize.STRING,
      allowNull: true, 
    },
  });
  return Notificacion;
};
