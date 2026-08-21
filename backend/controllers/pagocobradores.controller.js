const db = require("../models");
const PagoCobradores = db.PagoCobradores;
const { MovimientoCaja } = require("../middleware/movimientosCaja");

const getPagoCobradores = async (req, res) => {
  PagoCobradores.findAll({
    order: [["idpago", "DESC"]],
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

const postPagoCobradores = async (req, res) => {
  const FECHADESDE = req.body.fechadesde
  const FECHAHASTA = req.body.fechahasta
  const IDCOBRADOR = req.body.idcobrador
  const USUARIOALTA = req.body.usuarioalta
  const HOY = new Date();

  var f1 = new Date(FECHADESDE)
  var f2 = new Date(FECHAHASTA)

  const UltimoPago = await PagoCobradores.findOne({
    where: { idcobrador: IDCOBRADOR },
    order: [["idpago", "DESC"]],
  });

  if(!UltimoPago)
  {
    var f3 = f1 - 1
  }
  else
  {
    var f3 = UltimoPago.dataValues.fechadesde
  }

  if (f1 > f3)
  {
    var MONTOPAGO = (req.body.montorecaudado * req.body.porcentajepago) / 100
    const Post = {
      idcobrador: IDCOBRADOR,
      cobrador: req.body.cobrador,
      fechadesde : f1,
      fechahasta: f2,
      montorecaudado: req.body.montorecaudado,
      porcentajepago: req.body.porcentajepago,
      tipotransaccion: req.body.tipotransaccion,
      montopago: MONTOPAGO,
      fechaalta: HOY,
      usuarioalta: USUARIOALTA

    }
    var respuestaCreate = await PagoCobradores.create(Post)
    let IDPAGO = respuestaCreate.dataValues.idpago;
    var RespuestaCaja = await MovimientoCaja({
      transaccion: "Pago Cobrador",
      transacciondocumento: IDPAGO,
      tipotransaccion: req.body.tipotransaccion,
      tipo: "Egreso",
      monto: - MONTOPAGO,
      fechaalta: HOY,
      usuarioalta: USUARIOALTA,
    });
    if (RespuestaCaja)
    {
      res.status(200).send({
        message: "Pago por $"+respuestaCreate.dataValues.montopago+" efectuado correctamente",
      });
    }
    else {
      res.status(400).send({
        message: "Error en el ingreso a caja, informar al admisnitrador",
      });
    }
  }
  else
  {
    res.status(400).send({
      message: "Error, Fecha desde es menor a la fecha del último pago.",
    });
  }
};
module.exports = {
  getPagoCobradores,
  postPagoCobradores
};
