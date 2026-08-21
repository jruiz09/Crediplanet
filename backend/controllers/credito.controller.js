const db = require("../models");
const Credito = db.Credito;
const Cliente = db.Cliente;
const CreditoDetalle = db.CreditoDetalle;
const NoLaborales = db.NoLaborales;
const Caja = db.Caja;
const { MovimientoCaja } = require("../middleware/movimientosCaja");
const { nombreDelDiaSegunFecha } = require("../middleware/diaSemana");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const { Op } = require("sequelize"); 

const getCreditos = async (req, res) => {
  Credito.findAll({
    include: [CreditoDetalle],
    order: [["idcredito", "desc"]],
    where: {
    estado: {
          [Op.in]: ["Pendiente", "En Proceso", "Refinanciado"],
        },
}
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


const getRendicion = async (req, res) => {
  const IDCOBRADOR = req.params.idcobrador
  try {
    const sqlquery = "Select * from vw_rendicion where idcobrador = "+"'"+IDCOBRADOR+"'";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};


const getCreditosMobile = async (req, res) => {
  const { idcobrador, idcredito } = req.params;

  // Armamos el objeto 'where' en base a los parámetros recibidos
  const where = {};
  if (idcobrador) where.idcobrador = idcobrador;
  if (idcredito) where.idcredito = idcredito;

  try {
    const data = await Credito.findAll({
      where,
      include: [CreditoDetalle],
      order: [["idcredito", "desc"]],
    });

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ocurrió un error al obtener los créditos.",
    });
  }
};





const getResumenCredito = async (req, res) => {
  const IDCREDITO = req.params.idcredito
  try {
    const sqlquery = "select idcredito, sum(monto) monto, sum(montopago) montopago, count(cuota) cuotas, sum(CuotasPagas) cuotaspagas, sum(CuotasPendientes) cuotaspendientes, sum(cuotasextra) cuotasextras from ( "+
     "select idcredito,monto, montopago, cuota, "+
      "CASE WHEN montopago > 0 THEN 1 else 0 END CuotasPagas,"+
      "CASE WHEN montopago  is null THEN 1 else 0 END CuotasPendientes, "+
      "case when observaciones = 'Cuota Extra' then 1 else 0 END cuotasextra"+
      " from creditosdetalles ) Resu where idcredito = "+"'"+IDCREDITO+"' group by idcredito ";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};



const getCierreDia = async (req, res) => {
  const USUARIO = req.params.cobrador
  try {
    const sqlquery = "SELECT creditos.cliente,  creditosdetalles.idcredito, creditosdetalles.estado, creditosdetalles.cuota, creditosdetalles.monto, cajas.monto montopago, cajas.tipotransaccion, creditosdetalles.observaciones, creditosdetalles.usuarioedicion cobrador FROM creditosdetalles inner join creditos on creditos.idcredito = creditosdetalles.idcredito INNER JOIN cajas ON cajas.transacciondocumento = CONCAT(creditosdetalles.idcredito, '/', creditosdetalles.cuota) WHERE creditosdetalles.usuarioedicion = "+"'"+USUARIO+"'  AND DATE(creditosdetalles.fechaedicion) = CURDATE() AND DATE(cajas.fechaalta) = CURDATE();";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

const getRendido = async (req, res) => {
  const IDCOBRADOR = req.params.idcobrador
  try {
    const sqlquery = "Select * from vw_rendido where idcobrador = "+"'"+IDCOBRADOR+"'";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};


const getRendicionProductividadActual = async (req, res) => {
  try {
    const sqlquery = "Select * from vw_rendicion_productividad_actual";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};


const getResumenCreditos = async (req, res) => {
  try {
    const sqlquery = "Select * from vw_resumencreditos";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};


const getResumenCreditosDetalles = async (req, res) => {
  try {
    const sqlquery = "Select * from vw_resumencreditosdetalles";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};


const getResumenCreditosMensual = async (req, res) => {
  try {
    const sqlquery = "Select * from vw_resumenmensualcreditos";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};



const getRendicionProductividadSemanal = async (req, res) => {
  try {
    const sqlquery = "Select * from vw_rendicion_productividad_semanal";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};



const getCreditosSemanales = async (req, res) => {
  try {
    const sqlquery = "Select * from vw_creditossemanal";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};



const getCreditosSemanalesDetalles = async (req, res) => {
  try {
    const sqlquery = "Select * from vw_creditossemanaldetalle";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};


const postCreditos = async (req, res) => {
  const DIACREDITO = nombreDelDiaSegunFecha(req.body.fechainicio);

  if (DIACREDITO === 'Sabado' || DIACREDITO === "Domingo") {
    return res.status(400).send({
      message: "Error, no se pueden crear creditos fines de semana.",
    });
  }

  try {
    const HOY = new Date();
    const { idcliente, cliente, idplan, dias, monto, tipotransaccion, interes, fechainicio, usuarioalta } = req.body;

    const ExisteCliente = await Cliente.findOne({ where: { idcliente } });

    // Redondeo cuota y calculo nuevo monto total
    let VALORCUOTA = monto * (1 + interes / 100) / dias;
    VALORCUOTA = Math.ceil(VALORCUOTA / 50) * 50;
    const montototal = VALORCUOTA * dias;

    const PostCabecera = {
      estado: "Pendiente",
      idcliente,
      cliente,
      idcobrador: ExisteCliente.dataValues.idcobrador,
      cobrador: ExisteCliente.dataValues.nombrecobrador,
      idplan,
      dias,
      monto,
      montototal, // calculado
      tipotransaccion,
      interes,
      fechainicio,
      fechaalta: HOY,
      usuarioalta,
      fechaedicion: HOY,
      usuarioedicion: usuarioalta,
    };

    const creditoCreado = await Credito.create(PostCabecera);
    const IDCREDITO = creditoCreado.dataValues.idcredito;

    let FECHAPAGO = new Date(fechainicio);
    let FECHAVENCIMIENTO = new Date(fechainicio);

    for (let i = 1; i <= dias; i++) {
      let DIA = nombreDelDiaSegunFecha(FECHAPAGO);

      if (DIA === "jueves") {
        FECHAPAGO.setDate(FECHAPAGO.getDate() + 3);
      } else {
        FECHAPAGO.setDate(FECHAPAGO.getDate() + 1);
      }

      FECHAVENCIMIENTO = new Date(FECHAPAGO);
      FECHAVENCIMIENTO.setDate(FECHAPAGO.getDate() + 1);

      let esFeriado = await NoLaborales.findOne({ where: { fecha: FECHAPAGO } });

      if (esFeriado) {
        FECHAPAGO.setDate(FECHAPAGO.getDate() + (DIA === "jueves" ? 3 : 1));
        DIA = nombreDelDiaSegunFecha(FECHAPAGO);

        if (DIA === "viernes") {
          FECHAPAGO.setDate(FECHAPAGO.getDate() + 2);
        }

        FECHAVENCIMIENTO = new Date(FECHAPAGO);
        FECHAVENCIMIENTO.setDate(FECHAPAGO.getDate() + 1);
      }

      await CreditoDetalle.create({
        idcredito: IDCREDITO,
        cuota: i,
        monto: VALORCUOTA,
        fechapago: FECHAPAGO,
        estado: "Pendiente",
        fechavencimiento: FECHAVENCIMIENTO,
        fechaalta: HOY,
        usuarioalta,
        fechaedicion: HOY,
        usuarioedicion: usuarioalta,
      });
    }

    return res.status(200).json({ message: "Crédito creado correctamente", idcredito: IDCREDITO });

  } catch (error) {
    console.error("Error al crear crédito:", error);
    return res.status(500).send({ message: "Error al crear crédito", error });
  }
};


/*
const postCreditos = async (req, res) => {
  const DIACREDITO = nombreDelDiaSegunFecha(req.body.fechainicio);

  if (DIACREDITO === 'Sabado' || DIACREDITO === "Domingo") {
    return res.status(400).send({
      message: "Error, no se pueden crear creditos fines de semana.",
    });
  }

  try {
    const HOY = new Date();
    const { idcliente, cliente, idplan, dias, monto, montototal, tipotransaccion, interes, fechainicio, usuarioalta } = req.body;

    const ExisteCliente = await Cliente.findOne({ where: { idcliente } });

    const PostCabecera = {
      estado: "Pendiente",
      idcliente,
      cliente,
      idcobrador: ExisteCliente.dataValues.idcobrador,
      cobrador: ExisteCliente.dataValues.nombrecobrador,
      idplan,
      dias,
      monto,
      montototal,
      tipotransaccion,
      interes,
      fechainicio,
      fechaalta: HOY,
      usuarioalta,
      fechaedicion: HOY,
      usuarioedicion: usuarioalta,
    };

    const creditoCreado = await Credito.create(PostCabecera);
    const IDCREDITO = creditoCreado.dataValues.idcredito;

    // --- Redondear el valor de cuota al múltiplo más cercano de 50 o 100 hacia arriba
    let VALORCUOTA = montototal / dias;
    VALORCUOTA = Math.ceil(VALORCUOTA / 50) * 50;

    let FECHAPAGO = new Date(fechainicio);
    let FECHAVENCIMIENTO = new Date(fechainicio);

    for (let i = 1; i <= dias; i++) {
      let DIA = nombreDelDiaSegunFecha(FECHAPAGO);

      if (DIA === "jueves") {
        FECHAPAGO.setDate(FECHAPAGO.getDate() + 3);
      } else {
        FECHAPAGO.setDate(FECHAPAGO.getDate() + 1);
      }

      FECHAVENCIMIENTO = new Date(FECHAPAGO);
      FECHAVENCIMIENTO.setDate(FECHAPAGO.getDate() + 1);

      // Validar feriados
      let esFeriado = await NoLaborales.findOne({ where: { fecha: FECHAPAGO } });

      if (esFeriado) {
        FECHAPAGO.setDate(FECHAPAGO.getDate() + (DIA === "jueves" ? 3 : 1));
        DIA = nombreDelDiaSegunFecha(FECHAPAGO);

        if (DIA === "viernes") {
          FECHAPAGO.setDate(FECHAPAGO.getDate() + 2);
        }

        FECHAVENCIMIENTO = new Date(FECHAPAGO);
        FECHAVENCIMIENTO.setDate(FECHAPAGO.getDate() + 1);
      }

      await CreditoDetalle.create({
        idcredito: IDCREDITO,
        cuota: i, // comienza desde 1
        monto: VALORCUOTA,
        fechapago: FECHAPAGO,
        estado: "Pendiente",
        fechavencimiento: FECHAVENCIMIENTO,
        fechaalta: HOY,
        usuarioalta,
        fechaedicion: HOY,
        usuarioedicion: usuarioalta,
      });
    }

    const RespuestaCaja = await MovimientoCaja({
      transaccion: "Credito Nuevo",
      transacciondocumento: IDCREDITO,
      tipotransaccion,
      tipo: "Egreso",
      monto: -monto,
      fechaalta: HOY,
      usuarioalta,
    });

    if (RespuestaCaja) {
      return res.status(200).send({ message: "Credito creado correctamente" });
    } else {
      return res.status(400).send({ message: "Error en el ingreso a caja, informar al administrador" });
    }
  } catch (error) {
    return res.status(500).json({ message: "ERROR: " + error.message });
  }
};

*/




const deleteCredito = async (req, res) => {
  const id = req.params.idcredito;

  Caja.destroy({
    where: { transaccion: "Credito Nuevo",
  transacciondocumento : id }
  })

Credito.destroy({
  where: { idcredito: id }
})
  .then(num => {
    if (num == 1) {
      res.status(200).send({
        message: "Credito eliminado correctamente"
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
};


const getCuotasDiaxCobrador = async (req, res) => {
  const IDCOBRADOR = req.params.idcobrador
  try {
    const sqlquery = "Select * from vw_cuotasdiaxcobrador where idcobrador = "+"'"+IDCOBRADOR+"'";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};


const getCuotasPendientesxCobrador = async (req, res) => {
  const IDCOBRADOR = req.params.idcobrador
  try {
    const sqlquery = "Select * from vw_cuotaspenxcobrador where idcobrador = "+"'"+IDCOBRADOR+"'";
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
  getCreditos,
  postCreditos,
  getResumenCredito,
  getRendicion,
  getRendido,
  getRendicionProductividadActual,
  getRendicionProductividadSemanal,
  deleteCredito,
  getResumenCreditos,
  getResumenCreditosDetalles, 
  getResumenCreditosMensual,
  getCreditosSemanales,
  getCreditosSemanalesDetalles,
  getCuotasDiaxCobrador,
  getCreditosMobile,
  getCierreDia,
  getCuotasPendientesxCobrador
};
