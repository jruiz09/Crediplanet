const db = require("../models");
const Caja = db.Caja
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

const getCaja = async (req, res) => {
  Caja.findAll({
    order: [["idcaja", "DESC"]],
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrio un error",
      });
    });
};


const postCaja = async (req, res) => {
  const HOY = new Date();
  let MONTO = 0
  if (req.body.tipo === "Egreso")
  {
     MONTO = -req.body.monto 
  }
  else
  {
     MONTO = req.body.monto 
    
  }
  const POST = {
    transaccion: req.body.transaccion,
    transacciondocumento: req.body.transacciondocumento,
    tipotransaccion: req.body.tipotransaccion,
    tipo: req.body.tipo,
    monto: MONTO,
    observaciones : req.body.observaciones,
    fechaalta: HOY,
    usuarioalta: req.body.usuarioalta,
  }
  try {
    await Caja.create( POST ).then((data) => {
      res.status(200).send({
        message: "Movimiento generado correctamente",
        data: data,
      });
    });
  } catch (error) {
    res.json({ message: "ERROR: " + error.message });
  }
  
 
};


const getResumenCaja = async (req, res) => {
  try {
    const sqlquery = "Select * from vw_resumencaja";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};



module.exports = {
  getCaja,
  postCaja,
  getResumenCaja
};
