module.exports = (sequelize, Sequelize) => {
    const Credito = sequelize.define("creditos", {
        idcredito: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          estado: {
            type: Sequelize.STRING
          },
      idcliente: {
        type: Sequelize.INTEGER
      },
      cliente: {
        type: Sequelize.STRING
      },
      idcobrador: {
        type: Sequelize.INTEGER
      },
      cobrador: {
        type: Sequelize.STRING
      },
      idplan: {
        type: Sequelize.INTEGER
      },
      dias: {
        type: Sequelize.INTEGER
      },
      monto: {
        type: Sequelize.INTEGER
      },
      montototal: {
        type: Sequelize.INTEGER
      },
      tipotransaccion: {
        type: Sequelize.STRING
      },
      interes: {
        type: Sequelize.INTEGER
      },
      fechainicio: {
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
    return Credito;
  };