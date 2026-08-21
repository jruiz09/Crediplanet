module.exports = (sequelize, Sequelize) => {
    const NoLaborales = sequelize.define("nolaborales", {
        idnolaborales: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          fecha: {
        type: Sequelize.DATE
      },
      motivo: {
        type: Sequelize.STRING
      },
    }, 
    {
        timestamps: false});
    return NoLaborales;
  };