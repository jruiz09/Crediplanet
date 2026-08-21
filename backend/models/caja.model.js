module.exports = (sequelize, Sequelize) => {
    const Caja = sequelize.define("caja", {
        idcaja: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          transaccion: {
        type: Sequelize.STRING
      },
      transacciondocumento: {
        type: Sequelize.STRING
      },
      tipotransaccion: {
        type: Sequelize.STRING
      },
      observaciones: {
        type: Sequelize.STRING
      },
      tipo: {
        type: Sequelize.STRING
      },
      monto: {
        type: Sequelize.INTEGER
      },
      fechaalta: {
        type: Sequelize.DATE
      },
      usuarioalta: {
        type: Sequelize.STRING
      },
    }, 
    {
        timestamps: false});
    return Caja;
  };