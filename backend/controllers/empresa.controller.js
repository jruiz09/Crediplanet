const db = require("../models");
const Empresa = db.Empresa;

const getEmpresa = async (req, res) => {
  Empresa.findAll({
    order: [["idempresa", "DESC"]],
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

const postEmpresa = async (req, res) => {
  const RAZONSOCIAL = req.body.razonsocial;

  if (!Empresa) {
    res.status(400).send({
      message: "Error : Razon social obligatoria",
    });
  } else {
    try {
      await Empresa.create({ razonsocial: RAZONSOCIAL }).then((data) => {
        res.status(200).send({
          message: "Empresa creada correctamente",
          data: data,
        });
      });
    } catch (error) {
      res.json({ message: "ERROR: " + error.message });
    }
  }
};

module.exports = {
  getEmpresa,
  postEmpresa,
};
