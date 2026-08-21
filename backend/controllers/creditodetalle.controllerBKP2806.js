const db = require("../models");
const CreditoDetalle = db.CreditoDetalle;
const Credito = db.Credito;
const RendicionDiaria = db.RendicionDiaria
const RendicionSemanal = db.RendicionSemanal
const { MovimientoCaja } = require("../middleware/movimientosCaja");
const { Op } = require("sequelize");
const { nombreDelDiaSegunFecha } = require("../middleware/diaSemana");

const getDetalles = async (req, res) => {
    CreditoDetalle.findAll({
    order: [["idcredito", "desc"]],
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

const getDetallesxCredito = async (req, res) => {
    const IDCREDITO = req.params.idcredito
    CreditoDetalle.findAll({
    where :  {idcredito : IDCREDITO},
    order: [["cuota", "asc"]],
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

const PostCuotaAdicional = async (req, res) => {
  
  try {
  const IDCREDITO = req.body.idcredito
  const USUARIOALTA = req.body.usuarioalta;

  const ExisteCreditoCab = await Credito.findOne({
    where: { idcredito: IDCREDITO,
      estado:  ["Pendiente", "En Proceso"] },
  });
  if(!ExisteCreditoCab)
  {
    res.status(400).send({
      message: `No se añadir cuota a credito finalizado.`
    });
  }
  else
  {
    const ExisteCredito = await CreditoDetalle.findOne({
      where: { idcredito: IDCREDITO },
      order: [["cuota", "desc"]],
    });
    var FECHAPAGO  = ExisteCredito.dataValues.fechapago;
    
    console.log("FechaUltimaCuota", ExisteCredito.dataValues.fechapago)
    FECHAPAGO.setDate(FECHAPAGO.getDate() + 1)

    console.log("FechaProximaCuota", FECHAPAGO)
    var DIACREDITO = nombreDelDiaSegunFecha(FECHAPAGO);
    console.log("DIA", DIACREDITO)

    const HOY = new Date();
    await CreditoDetalle.create({
      idcredito: IDCREDITO,
      cuota: ExisteCredito.dataValues.cuota + 1,
      monto: ExisteCredito.dataValues.monto,
      fechapago: ExisteCredito.dataValues.fechapago + 1,
      estado: "Pendiente",
      observaciones: "Cuota extra",
      fechaalta: HOY,
      usuarioalta: USUARIOALTA,
      fechaedicion: HOY,
      usuarioedicion: USUARIOALTA,
    })
  }

  res.status(200).send({
    message: "Cuota adicional creada correctamente",
  })
} catch (error) {
  console.log(error);
  res.json({ message: error.message });
}

}

const PagoCuota = async (req, res) => {
  const IDLINEA = req.params.idcreditodetalle
  const HOY = new Date();
  const MONTOPAGO = req.body.montopago
  const USUARIO = req.body.usuario

  const ExisteLinea = await CreditoDetalle.findOne({
    where: { idcreditodetalle: IDLINEA },
  });

  const ExisteCredito = await Credito.findOne({
    where: { idcredito: ExisteLinea.dataValues.idcredito,
      estado:  ["Pendiente", "En Proceso"]
     },
  });


  if(ExisteLinea)
  {
    if(MONTOPAGO === ExisteLinea.dataValues.monto - ExisteLinea.dataValues.montopago)
    {
      var RespuestaCaja = await MovimientoCaja({
        transaccion: "Pago Cuota",
        transacciondocumento: ExisteLinea.dataValues.idcredito + "/"+ ExisteLinea.dataValues.cuota ,
        tipotransaccion: req.body.tipotransaccion,
        tipo: "Ingreso",
        monto: MONTOPAGO,
        fechaalta: HOY,
        usuarioalta: USUARIO,
      });
      if (ExisteCredito)
      {
        Credito.update({estado : "En Proceso"},
        {where : {idcredito : ExisteCredito.dataValues.idcredito}})
      }
      RendicionDiaria.create(
        {
          idcobrador : ExisteCredito.dataValues.idcobrador,
          cobrador: ExisteCredito.dataValues.cobrador,
          idcreditodetalle: IDLINEA,
          nocontabiliza: req.body.nocontabiliza,
          real: MONTOPAGO,
          fecha: ExisteLinea.dataValues.fechapago,
          fechacarga: HOY
        }
      ) 
      CreditoDetalle.update(
        {
          fechaedicion: HOY,
          tipotransaccion: req.body.tipotransaccion,
          usuarioedicion : USUARIO,
          montopago : MONTOPAGO,
          nocontabiliza: req.body.nocontabiliza,
          observaciones: req.body.observaciones,
          estado: "Pago Registrado"
        }, {
        where : {idcreditodetalle : IDLINEA}
    })
   
    .then(num => {
        if (num == 1) {

          res.status(200).send({
            message: "Cuota paga"
          });
        } else {
          res.status(400).send({
            message: `no se puede actualizar el cobrador id=${id}.`
          });
        }
      })
      
      .catch(err => {
        res.status(500).send({
          message: "Error: " + err
        });
      });
      const ExisteLineasPendientes = await CreditoDetalle.findOne({
        where: { idcredito: ExisteLinea.dataValues.idcredito,
        idcreditodetalle : {[Op.not]:  IDLINEA },
        estado : ["Pendiente", "Pago Parcial"] },
      });
      
      if (!ExisteLineasPendientes)
      {
        Credito.update({estado : "Finalizado"},
        {where : {idcredito : ExisteCredito.dataValues.idcredito}})
      }
      console.log("Valores", ExisteLineasPendientes)
    }
    else if((MONTOPAGO < ExisteLinea.dataValues.monto - ExisteLinea.dataValues.montopago) && MONTOPAGO > 0)
    {
      var RespuestaCaja = await MovimientoCaja({
        transaccion: "Pago parcial Cuota",
        transacciondocumento: ExisteLinea.dataValues.idcredito + "/"+ ExisteLinea.dataValues.cuota ,
        tipotransaccion: req.body.tipotransaccion,
        tipo: "Ingreso",
        monto: MONTOPAGO,
        fechaalta: HOY,
        usuarioalta: USUARIO,
      });
      if (ExisteCredito)
      {
        Credito.update({estado : "En Proceso"},
        {where : {idcredito : ExisteCredito.dataValues.idcredito}})
      }
      RendicionDiaria.create(
        {
          idcobrador : ExisteCredito.dataValues.idcobrador,
          cobrador: ExisteCredito.dataValues.cobrador,
          idcreditodetalle: IDLINEA,
          nocontabiliza: req.body.nocontabiliza,
          real: MONTOPAGO,
          fecha: ExisteLinea.dataValues.fechapago,
          fechacarga: HOY
        }
      ) 
      CreditoDetalle.update(
        {
          fechaedicion: HOY,
          usuarioedicion : USUARIO,
          tipotransaccion: req.body.tipotransaccion,
          montopago : MONTOPAGO + ExisteLinea.dataValues.montopago,
          nocontabiliza: req.body.nocontabiliza,
          observaciones: req.body.observaciones,
          estado: "Pago Parcial"
        }, {
        where : {idcreditodetalle : IDLINEA}
    })
   
    .then(num => {
        if (num == 1) {
          
          res.status(200).send({
            message: "Cuota paga de forma parcial"
          });
        } else {
          res.status(400).send({
            message: `no se puede actualizar el cobrador id=${id}.`
          });
        }
      })
      
      .catch(err => {
        res.status(500).send({
          message: "Error: " + err
        });
      });
    }
    else
    {
      res.status(400).send({
        message: "Error: El monto a pagar no puede ser 0 o debe ser igual o menor al monto esperado "+ ExisteLinea.dataValues.monto,
      });
    }
  }
  else
  {
    res.status(400).send({
      message: "Error: No existe el detalle del crédito",
    });
  }

}

const deleteCuota = async (req, res) => {
  const id = req.params.idcreditodetalle;

const CuotaValida = await CreditoDetalle.findOne({
  where: {idcreditodetalle : id,
  estado : "Pendiente"}
})
  
if(!CuotaValida)
{
  res.status(400).send({
    message: `Error - El estado de la cuota debe ser Pendiente.`
  })
}
else
{
  
CreditoDetalle.destroy({
  where: { idcreditodetalle: id }
})
  .then(num => {
    if (num == 1) {
      res.status(200).send({
        message: "Cuota eliminada correctamente"
      });
    } else {
      res.status(400).send({
        message: `No se puede eliminar el Cliente id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error: "+ err
    });
  });
}
};




module.exports = {
    getDetalles,
    getDetallesxCredito,
    PagoCuota,
    PostCuotaAdicional,
    deleteCuota
};
