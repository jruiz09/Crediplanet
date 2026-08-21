const db = require("../models");
const Plan = db.Plan;

const getPlan = async (req, res) => {
  Plan.findAll({
    order: [["dias", "asc"]],
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


const postPlan = async (req, res) => {
   
  
    try {
      await Plan.create( req.body ).then((data) => {
        res.status(200).send({
          message: "Plan creado correctamente",
          data: data,
        });
      });
    } catch (error) {
      res.json({ message: "ERROR: " + error.message });
    }
    }
  

const putPlan = async (req, res) => {
    const IDPLAN = req.params.idplan;

    Plan.update(req.body, {
        where : {idplan : IDPLAN}
    })
   
    .then(num => {
        if (num == 1) {
          res.status(200).send({
            message: "Plan actualizado correctamente"
          });
        } else {
          res.status(400).send({
            message: `no se puede actualizar el plan id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error: " + err
        });
      });
}


const deletePlan = async (req, res) => {
    const id = req.params.idplan;

  Plan.destroy({
    where: { idplan: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Plan eliminado correctamente"
        });
      } else {
        res.status(400).send({
          message: `No se puede eliminar el plan id=${id}.`
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
  getPlan,
  postPlan,
  putPlan,
  deletePlan,
};
