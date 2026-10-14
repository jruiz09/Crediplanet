module.exports = (sequelize, Sequelize) => {
    const Pantalla = sequelize.define("pantallas", {
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      app: {
        type: Sequelize.ENUM('adm', 'mobile'),
        allowNull: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
        timestamps: false});
    return Pantalla;
  };
