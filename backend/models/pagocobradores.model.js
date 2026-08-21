module.exports = (sequelize, Sequelize) => {
    const PagoCobradores = sequelize.define("pagocobradores", {
        idpago: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          idcobrador: {
            type: Sequelize.INTEGER
          },
          cobrador: {
            type: Sequelize.STRING
          },
          
          fechadesde: {
            type: Sequelize.DATE
          },
          fechahasta: {
            type: Sequelize.DATE
          },
      montorecaudado: {
        type: Sequelize.INTEGER
      },
      porcentajepago: {
        type: Sequelize.INTEGER
      },
      montopago: {
        type: Sequelize.INTEGER
      },
      tipotransaccion: {
        type: Sequelize.STRING
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
    return PagoCobradores;
  };