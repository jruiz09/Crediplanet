const db = require("../models");
const NoLaborales = db.NoLaborales
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

const getDias = async (req, res) => {
    NoLaborales.findAll({
    order: [["fecha", "asc"]],
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


const postDias = async (req, res) => {
  
  try {
    await NoLaborales.create( req.body ).then((data) => {
      res.status(200).send({
        message: "Día cargado correctamente",
        data: data,
      });
    });
  } catch (error) {
    res.json({ message: "ERROR: " + error.message });
  }
  
 
};


const putDias = async (req, res) => {
    const ID = req.params.idnolaborales;

    NoLaborales.update(req.body, {
        where : {idnolaborales : ID}
    })
   
    .then(num => {
        if (num == 1) {
          res.status(200).send({
            message: "Día actualizado correctamente"
          });
        } else {
          res.status(400).send({
            message: `no se puede actualizar el día =${req.body.fecha}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error: " + err
        });
      });
}


const deleteDias = async (req, res) => {
    
    const ID = req.params.idnolaborales;

  NoLaborales.destroy({
    where: { idnolaborales: ID }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Día eliminado correctamente"
        });
      } else {
        res.status(400).send({
          message: `No se puede eliminar el día id=${id}.`
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
  getDias,
  postDias,
  putDias,
  deleteDias
};
