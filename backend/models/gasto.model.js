module.exports = (sequelize, Sequelize) => {
  const Gasto = sequelize.define(
    "gastos",
    {
      idgasto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      descripcion: {
        type: Sequelize.STRING,
      },
      monto: {
        type: Sequelize.INTEGER,
      },
      tipotransaccion: {
        type: Sequelize.STRING
      },
      fechaalta: {
        type: Sequelize.DATE,
      },
      usuarioalta: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Gasto;
};
