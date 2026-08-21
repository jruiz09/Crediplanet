const db = require("../models");
const Gasto = db.Gastos;
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const Caja = db.Caja;
const { MovimientoCaja } = require("../middleware/movimientosCaja");

const getGasto = async (req, res) => {
  Gasto.findAll({
    order: [["idgasto", "DESC"]],
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

const getGastoPorMes = async (req, res) => {
  try {
    const sqlquery = "Select * from resumengastosmes";
    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

    

const postGasto = async (req, res) => {
    const DESCRIPCION = req.body.descripcion;

    if(!DESCRIPCION)
    {
        res.status(400).send({
            message: "Error : la descripción es obligatoria",
          });
    }
    else 
    {
        
    const HOY = new Date();
    const Post = {
        descripcion : req.body.descripcion,
        monto : req.body.monto,
        tipotransaccion: req.body.tipotransaccion,
        fechaalta: HOY,
        usuarioalta: req.body.usuarioalta
      }
    try {


      var respuestaCreate = await Gasto.create(Post);
      console.log("Credito", respuestaCreate);
      let IDGASTO = respuestaCreate.dataValues.idgasto;
     
     var RespuestaCaja =  await MovimientoCaja({
        transaccion: "Gasto Nuevo",
        transacciondocumento: IDGASTO,
        tipotransaccion: req.body.tipotransaccion,
        tipo: "Egreso",
        monto: - req.body.monto,
        fechaalta: HOY,
        usuarioalta: req.body.usuarioalta,
      })
      if (RespuestaCaja)
      {
        res.status(200).send({
          message: "Gasto creado correctamente",
        });
      }
      else {
        res.status(400).send({
          message: "Error en el ingreso a caja, informar al admisnitrador",
        });
      }

    } catch (error) {
      res.json({ message: "ERROR: " + error.message });
    }
    }
  }
;

const putGasto = async (req, res) => {
    const IDGasto = req.params.idgasto;

    Gasto.update(req.body, {
        where : {idgasto : IDGasto}
    })
   
    .then(num => {
        if (num == 1) {
          res.status(200).send({
            message: "Gasto actualizado correctamente"
          });
        } else {
          res.status(400).send({
            message: `no se puede actualizar el Gasto id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error: " + err
        });
      });
}


const deleteGasto = async (req, res) => {
    const id = req.params.idgasto;

  Gasto.destroy({
    where: { idgasto: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Gasto eliminado correctamente"
        });
      } else {
        res.status(400).send({
          message: `No se puede eliminar el Gasto id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error: "+ err
      });
    });
  };

module.exports = {
  getGasto,
  postGasto,
  putGasto,
  deleteGasto,
  getGastoPorMes
};
