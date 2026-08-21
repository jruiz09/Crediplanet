const db = require("../models");
const Cobrador = db.Cobrador;

const getCobrador = async (req, res) => {
  Cobrador.findAll({
    order: [["idcobrador", "DESC"]],
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

const getCobradorxEmpresa = async (req, res) => {
    const IDEMPRESA = req.params.idempresa;
      Cobrador.findAll({
         where: {idempresa : IDEMPRESA} ,
        order: [["idcobrador", "DESC"]],
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
    

const postCobrador = async (req, res) => {
    const IDEMPRESA = req.body.idempresa;
    const NOMBRE = req.body.nombreyapellido;
    if(!IDEMPRESA)
    {
        res.status(400).send({
            message: "Error : el idempresa es obligatorio",
          });
    }


  else {
    if(!NOMBRE)
    {
        res.status(400).send({
            message: "Error : el nombre es obligatorio",
          });
    }
    else 
    {
    const Post = {
        nombreyapellido : req.body.nombreyapellido,
        dni : req.body.dni,
        celular: req.body.celular,
        idempresa: IDEMPRESA
      }
    try {
      await Cobrador.create( Post ).then((data) => {
        res.status(200).send({
          message: "Cobrador creado correctamente",
          data: data,
        });
      });
    } catch (error) {
      res.json({ message: "ERROR: " + error.message });
    }
    }
  }
};

const putCobrador = async (req, res) => {
    const IDCOBRADOR = req.params.idcobrador;

    Cobrador.update(req.body, {
        where : {idcobrador : IDCOBRADOR}
    })
   
    .then(num => {
        if (num == 1) {
          res.status(200).send({
            message: "Cobrador actualizado correctamente"
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


const deleteCobrador = async (req, res) => {
    const id = req.params.idcobrador;

  Cobrador.destroy({
    where: { idcobrador: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Cobrador eliminado correctamente"
        });
      } else {
        res.status(400).send({
          message: `No se puede eliminar el cobrador id=${id}.`
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
  getCobrador,
  getCobradorxEmpresa,
  postCobrador,
  putCobrador,
  deleteCobrador,
};
