module.exports = (sequelize, Sequelize) => {
    const Vale = sequelize.define("vale", {
        idvale: {
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
      ingreso: {
        type: Sequelize.INTEGER
      },
      egreso: {
        type: Sequelize.INTEGER
      },
      estado: {
        type: Sequelize.STRING
      },
      
      tipotransaccion: {
        type: Sequelize.STRING
      },
      observaciones: {
        type: Sequelize.STRING
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
    return Vale;
  };