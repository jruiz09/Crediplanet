module.exports = (sequelize, Sequelize) => {
    const Plan = sequelize.define("planes", {
        idplan: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
      descripcion: {
        type: Sequelize.STRING
      },
      dias: {
        type: Sequelize.INTEGER
      },
    }, 
    {
        timestamps: false});
    return Plan;
  };