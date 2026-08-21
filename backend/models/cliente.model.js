module.exports = (sequelize, Sequelize) => {
    const Cliente = sequelize.define("clientes", {
        idcliente: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
      nombreyapellido: {
        type: Sequelize.STRING
      },
      direccion: {
        type: Sequelize.STRING
      },
      celular: {
        type: Sequelize.STRING
      },
      idcobrador: {
        type: Sequelize.INTEGER
      }
      ,
      nombrecobrador: {
        type: Sequelize.STRING
      }
      ,
      idempresa: {
        type: Sequelize.INTEGER
      },
      foto: {
  type: Sequelize.STRING, // puede ser la ruta o URL
  allowNull: true
}
    }, 
    {
        timestamps: false});
    return Cliente;
  };