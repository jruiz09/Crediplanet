module.exports = (sequelize, Sequelize) => {
    const Empresa = sequelize.define("empresas", {
        idempresa: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
      razonsocial: {
        type: Sequelize.STRING
      }
    }, 
    {
        timestamps: false});
    return Empresa;
  };