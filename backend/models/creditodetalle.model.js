module.exports = (sequelize, Sequelize) => {
    const CreditoDetalle = sequelize.define("creditosdetalles", {
        idcreditodetalle: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
      idcredito: {
        type: Sequelize.INTEGER
      },
      estado: {
        type: Sequelize.STRING
      },
      cuota: {
        type: Sequelize.INTEGER
      },
      monto: {
        type: Sequelize.INTEGER
      },
      montopago: {
        type: Sequelize.INTEGER
      },
      tipotransaccion: {
        type: Sequelize.STRING
      },
      
      observaciones: {
        type: Sequelize.STRING
      },
      nocontabiliza: {
        type: Sequelize.BOOLEAN
      },
      refinanciado: {
        type: Sequelize.BOOLEAN
      },
      fechapago: {
        type: Sequelize.DATE
      },
      fechavencimiento: {
        type: Sequelize.DATE
      },
      fechapago: {
        type: Sequelize.DATE
      },
      fechaalta: {
        type: Sequelize.DATE
      },
      usuarioalta: {
        type: Sequelize.STRING
      },
      fechaedicion: {
        type: Sequelize.DATE
      },
      usuarioedicion: {
        type: Sequelize.STRING
      },
    }, 
    {
        timestamps: false});
    return CreditoDetalle;
  };