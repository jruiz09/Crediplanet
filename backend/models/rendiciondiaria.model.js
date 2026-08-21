module.exports = (sequelize, Sequelize) => {
    const RendicionDiaria = sequelize.define("rendiciondiaria", {
        idrendicion: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          idcobrador: {
        type: Sequelize.INTEGER
      },
      idcreditodetalle: {
        type: Sequelize.INTEGER
      },
      cobrador: {
        type: Sequelize.STRING
      },
      real: {
        type: Sequelize.INTEGER
      },
      fecha: {
        type: Sequelize.DATE
      },
      fechacarga: {
        type: Sequelize.DATE
      },
      procesado: {
        type: Sequelize.STRING
      },
      
      nocontabiliza: {
        type: Sequelize.BOOLEAN
      },
    }, 
    {
        timestamps: false});
    return RendicionDiaria;
  };