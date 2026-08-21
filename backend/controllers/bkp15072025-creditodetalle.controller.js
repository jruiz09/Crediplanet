const db = require("../models");
const CreditoDetalle = db.CreditoDetalle;
const Credito = db.Credito;
const RendicionDiaria = db.RendicionDiaria;
const RendicionSemanal = db.RendicionSemanal;
const NoLaborales = db.NoLaborales;
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
  const IDCREDITO = req.params.idcredito;
  CreditoDetalle.findAll({
    where: { idcredito: IDCREDITO },
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
    const IDCREDITO = req.body.idcredito;
    const USUARIOALTA = req.body.usuarioalta;

    const ExisteCreditoCab = await Credito.findOne({
      where: { idcredito: IDCREDITO, estado: ["Pendiente", "En Proceso"] },
    });
    if (!ExisteCreditoCab) {
      res.status(400).send({
        message: `No se añadir cuota a credito finalizado.`,
      });
    } else {
      const ExisteCredito = await CreditoDetalle.findOne({
        where: { idcredito: IDCREDITO },
        order: [["cuota", "desc"]],
      });
      var FECHAPAGO = ExisteCredito.dataValues.fechapago;

      console.log("FechaUltimaCuota", ExisteCredito.dataValues.fechapago);

      var DIACREDITO = nombreDelDiaSegunFecha(FECHAPAGO);
      console.log("DIA", DIACREDITO);

      if (DIACREDITO == "jueves") {
        console.log("Entro viernes");
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        FECHAPAGO.setDate(FECHAPAGO.getDate() + 3);
        DIA = nombreDelDiaSegunFecha(FECHAPAGO);

        var ExisteFecha = await NoLaborales.findOne({
          where: { fecha: FECHAPAGO },
        });

        if (ExisteFecha) {
          FECHAPAGO.setDate(FECHAPAGO.getDate() + 3);
          var DIA = nombreDelDiaSegunFecha(FECHAPAGO);
          console.log("Dia de la semana DENTRO VALIDACION", FECHAPAGO);
        }
        console.log("Postea FechaPago", FECHAPAGO);
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
        });
      } else {
        console.log("entro default");
        FECHAPAGO.setDate(FECHAPAGO.getDate() + 1);
        DIA = nombreDelDiaSegunFecha(FECHAPAGO);
        console.log("Entro Dia de semana => ", DIA);
        var ExisteFecha = await NoLaborales.findOne({
          where: { fecha: FECHAPAGO },
        });

        if (ExisteFecha) {
          FECHAPAGO.setDate(FECHAPAGO.getDate() + 1);
          var DIA = nombreDelDiaSegunFecha(FECHAPAGO);
          console.log("** VALIDA FERIADO FECHA**", FECHAPAGO);

          console.log("** VALIDA FERIADO DIA**", DIA);
          if (DIA === "viernes") {
            FECHAPAGO.setDate(FECHAPAGO.getDate() + 2);
            var DIA = nombreDelDiaSegunFecha(FECHAPAGO);
          }
        }
        console.log("Postea FechaPago", FECHAPAGO);
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
        });
      }
    }

    res.status(200).send({
      message: "Cuota adicional creada correctamente",
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

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


const PagoCuotaMobile = async (req, res) => {
  const io = req.app.get("io");
  const IDLINEA = req.params.idcreditodetalle;
  const HOY = new Date();
  const MONTOPAGO = req.body.montopago;
  const USUARIO = req.body.usuario;

  try {
    const ExisteLinea = await CreditoDetalle.findOne({ where: { idcreditodetalle: IDLINEA } });
    if (!ExisteLinea) {
      return res.status(400).json({ message: "Error: No existe el detalle del crédito" });
    }

    const ExisteCredito = await Credito.findOne({
      where: {
        idcredito: ExisteLinea.idcredito,
        estado: ["Pendiente", "En Proceso"],
      },
    });

    const MONTO_RESTANTE = ExisteLinea.monto - ExisteLinea.montopago;

    if (MONTOPAGO === MONTO_RESTANTE) {
      // 🟢 Pago total
      await MovimientoCaja({
        transaccion: "Pago Cuota",
        transacciondocumento: `${ExisteLinea.idcredito}/${ExisteLinea.cuota}`,
        tipotransaccion: req.body.tipotransaccion,
        tipo: "Ingreso",
        monto: MONTOPAGO,
        fechaalta: HOY,
        usuarioalta: USUARIO,
      });

      if (ExisteCredito) {
        await Credito.update({ estado: "En Proceso" }, { where: { idcredito: ExisteCredito.idcredito } });
      }

      await RendicionDiaria.create({
        idcobrador: ExisteCredito.idcobrador,
        cobrador: ExisteCredito.cobrador,
        idcreditodetalle: IDLINEA,
        nocontabiliza: req.body.nocontabiliza,
        real: MONTOPAGO,
        fecha: ExisteLinea.fechapago,
        fechacarga: HOY,
      });

      await CreditoDetalle.update(
        {
          fechaedicion: HOY,
          tipotransaccion: req.body.tipotransaccion,
          usuarioedicion: USUARIO,
          montopago: MONTOPAGO,
          nocontabiliza: req.body.nocontabiliza,
          observaciones: req.body.observaciones,
          estado: "Pago Registrado",
        },
        { where: { idcreditodetalle: IDLINEA } }
      );

      const notificacion = await db.Notificacion.create({
  idcredito: ExisteCredito.idcredito,
  idcreditodetalle: IDLINEA,
  cliente: ExisteCredito.cliente,
  idcobrador: ExisteCredito.idcobrador,
  cuota: ExisteLinea.cuota,
  monto: MONTOPAGO,
  tipo: MONTOPAGO === MONTO_RESTANTE ? "Total" : "Parcial",
  cobrador: USUARIO,
  latitud: req.body.latitud,
  longitud: req.body.longitud
});

// 🔔 Emití la notificación en tiempo real
io.emit("nuevaNotificacion", {
  id: notificacion.id,
  mensaje: `El cliente ${ExisteCredito.cliente} pagó la cuota ${ExisteLinea.cuota}`,
  idcredito: ExisteCredito.idcredito,
  cuota: ExisteLinea.cuota,
  cliente: ExisteCredito.cliente,
  cobrador: USUARIO,
  tipo: MONTOPAGO === MONTO_RESTANTE ? "Total" : "Parcial",
  fecha: new Date()
});


      // 🟡 Finaliza crédito si no hay más cuotas pendientes
      const ExisteLineasPendientes = await CreditoDetalle.findOne({
        where: {
          idcredito: ExisteLinea.idcredito,
          idcreditodetalle: { [Op.not]: IDLINEA },
          estado: ["Pendiente", "Pago Parcial"],
        },
      });

      if (!ExisteLineasPendientes) {
        await Credito.update({ estado: "Finalizado" }, { where: { idcredito: ExisteCredito.idcredito } });
      }

      return res.status(200).json({ message: "Cuota paga" });

    } else if (MONTOPAGO > 0 && MONTOPAGO < MONTO_RESTANTE) {
      // 🟡 Pago parcial
      await MovimientoCaja({
        transaccion: "Pago parcial Cuota",
        transacciondocumento: `${ExisteLinea.idcredito}/${ExisteLinea.cuota}`,
        tipotransaccion: req.body.tipotransaccion,
        tipo: "Ingreso",
        monto: MONTOPAGO,
        fechaalta: HOY,
        usuarioalta: USUARIO,
      });

      if (ExisteCredito) {
        await Credito.update({ estado: "En Proceso" }, { where: { idcredito: ExisteCredito.idcredito } });
      }

      await RendicionDiaria.create({
        idcobrador: ExisteCredito.idcobrador,
        cobrador: ExisteCredito.cobrador,
        idcreditodetalle: IDLINEA,
        nocontabiliza: req.body.nocontabiliza,
        real: MONTOPAGO,
        fecha: ExisteLinea.fechapago,
        fechacarga: HOY,
      });

      await CreditoDetalle.update(
        {
          fechaedicion: HOY,
          usuarioedicion: USUARIO,
          tipotransaccion: req.body.tipotransaccion,
          montopago: MONTOPAGO + ExisteLinea.montopago,
          nocontabiliza: req.body.nocontabiliza,
          observaciones: req.body.observaciones,
          estado: "Pago Parcial",
        },
        { where: { idcreditodetalle: IDLINEA } }
      );
      const notificacion = await db.Notificacion.create({
  idcredito: ExisteCredito.idcredito,
  idcreditodetalle: IDLINEA,
  cliente: ExisteCredito.cliente,
  idcobrador: ExisteCredito.idcobrador,
  cuota: ExisteLinea.cuota,
  monto: MONTOPAGO,
  tipo: MONTOPAGO === MONTO_RESTANTE ? "Total" : "Parcial",
  cobrador: USUARIO,
  latitud: req.body.latitud,
  longitud: req.body.longitud
});

// 🔔 Emití la notificación en tiempo real
io.emit("nuevaNotificacion", {
  id: notificacion.id,
  mensaje: `El cliente ${ExisteCredito.cliente} pagó la cuota ${ExisteLinea.cuota}`,
  idcredito: ExisteCredito.idcredito,
  cuota: ExisteLinea.cuota,
  cliente: ExisteCredito.cliente,
  cobrador: USUARIO,
  tipo: MONTOPAGO === MONTO_RESTANTE ? "Total" : "Parcial",
  fecha: new Date()
});


      return res.status(200).json({ message: "Cuota paga de forma parcial" });

    } else {
      return res.status(400).json({
        message: `Monto inválido. Debe ser mayor a 0 y menor o igual a ${MONTO_RESTANTE}`,
      });
    }

  } catch (error) {
    console.error("❌ Error en PagoCuotaMobile:", error);
    return res.status(500).json({ message: "Error interno: " + error.message });
  }
};
;

const deleteCuota = async (req, res) => {
  const id = req.params.idcreditodetalle;

  const CuotaValida = await CreditoDetalle.findOne({
    where: { idcreditodetalle: id, estado: "Pendiente" },
  });

  if (!CuotaValida) {
    res.status(400).send({
      message: `Error - El estado de la cuota debe ser Pendiente.`,
    });
  } else {
    CreditoDetalle.destroy({
      where: { idcreditodetalle: id },
    })
      .then((num) => {
        if (num == 1) {
          res.status(200).send({
            message: "Cuota eliminada correctamente",
          });
        } else {
          res.status(400).send({
            message: `No se puede eliminar el Cliente id=${id}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error: " + err,
        });
      });
  }
};

const refinanciarCredito = async (req, res) => {
  const id = req.params.idcredito;
  const HOY = new Date();

  try {
    // Buscar cuotas NO finalizadas del crédito
    const cuotas = await CreditoDetalle.findAll({
      where: {
        idcredito: id,
        estado: { [Op.not]: "Pago Registrado" },
      },
    });

    if (cuotas.length === 0) {
      return res
        .status(200)
        .json({ message: "No hay cuotas pendientes para actualizar." });
    }

    // Actualizar cada cuota no finalizada
    for (const cuota of cuotas) {
      await CreditoDetalle.update(
        {
          estado: "Pago Registrado",
          montopago: cuota.monto,
          refinanciado: 1,
          nocontabiliza: 1,
          observaciones: "Refinanciado",
          fechaedicion: HOY,
        },
        {
          where: { idcreditodetalle: cuota.idcreditodetalle },
        }
      );
    }

    // Actualizar cabecera del crédito
    await Credito.update(
      {
        estado: "Refinanciado",
        fechaedicion: HOY,
      },
      {
        where: { idcredito: id },
      }
    );

    return res
      .status(200)
      .json({ message: "Crédito refinanciado correctamente.", credito: id });
  } catch (error) {
    console.error("Error al refinanciar crédito:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getDetalles,
  getDetallesxCredito,
  PagoCuota,
  PostCuotaAdicional,
  deleteCuota,
  refinanciarCredito,
  PagoCuotaMobile
};
