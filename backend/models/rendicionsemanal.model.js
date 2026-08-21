module.exports = (sequelize, Sequelize) => {
    const RendicionSemanal = sequelize.define("rendicionsemanal", {
        idrendicion: {
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
      estimado: {
        type: Sequelize.INTEGER
      },
      real: {
        type: Sequelize.INTEGER
      },
      productividad: {
        type: Sequelize.INTEGER
      },
      semana: {
        type: Sequelize.INTEGER
      },
      fechacarga: {
        type: Sequelize.DATE
      },
    }, 
    {
        timestamps: false});
    return RendicionSemanal;
  };