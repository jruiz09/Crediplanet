module.exports = (sequelize, Sequelize) => {
    const Cobrador = sequelize.define("cobradores", {
        idcobrador: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
      nombreyapellido: {
        type: Sequelize.STRING
      },
      dni: {
        type: Sequelize.INTEGER
      },
      celular: {
        type: Sequelize.STRING
      },
      idempresa: {
        type: Sequelize.INTEGER
      }
    }, 
    {
        timestamps: false});
    return Cobrador;
  };