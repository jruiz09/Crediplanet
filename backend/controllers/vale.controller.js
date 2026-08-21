const db = require("../models");
const Vale = db.Vale
const { MovimientoCaja } = require("../middleware/movimientosCaja");

const getVale = async (req, res) => {
  Vale.findAll({
    order: [["idvale", "DESC"]],
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



const postVale = async (req, res) => {
  const HOY = new Date();
  const POST = {
    idcobrador: req.body.idcobrador,
    cobrador : req.body.cobrador,
   egreso : req.body.egreso,
   estado : "Iniciado",
  usuarioalta : req.body.usuarioalta,
fechaalta : HOY
  }
  try {
   var respuestaCreate =  await Vale.create( POST);
console.log("respuestaCreate", respuestaCreate)

    if (respuestaCreate)
    {
      res.status(200).send({
        message: "Vale iniciado correctamente",
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
  
 
};

const putVale = async (req, res) => {
  
  const HOY = new Date();
  const Post = {
    ingreso : req.body.ingreso,
    estado : "Cerrado",
    tipotransaccion: req.body.tipotransaccion,
    observaciones: req.body.observaciones,
    usuarioedicion : req.body.usuarioedicion,
    fechaedicion : HOY
  }
  try {
    await   Vale.update(Post, {
      where : {idvale : req.params.idvale}
      
  }
  
  )
 
  .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Vale cerrado correctamente"
        });
      } else {
        res.status(400).send({
          message: `no se puede cerrar el vale id=${id}.`
        });
      }
    })
    
    .catch(err => {
      res.status(500).send({
        message: "Error: " + err
      });
    });
  } catch (error) {
    res.json({ message: "ERROR: " + error.message });
  }
  
};

const deleteVale = async (req, res) => {
  const id = req.params.ivale;

Vale.destroy({
  where: { idvale: id }
})
  .then(num => {
    if (num == 1) {
      res.status(200).send({
        message: "Vale eliminado correctamente"
      });
    } else {
      res.status(400).send({
        message: `No se puede eliminar el vale id=${id}.`
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
  getVale,
  postVale,
  putVale,
  deleteVale
};
