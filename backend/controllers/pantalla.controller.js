const db = require("../models");
const Pantalla = db.Pantalla;

const getPantallas = async (req, res) => {
  try {
    const where = {};
    if (req.query.app) where.app = req.query.app;

    const pantallas = await Pantalla.findAll({ where, order: [["codigo", "ASC"]] });
    res.status(200).send(pantallas);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getPantalla = async (req, res) => {
  try {
    const pantalla = await Pantalla.findByPk(req.params.id);
    if (!pantalla) {
      return res.status(404).send({ message: "Pantalla no encontrada" });
    }
    res.status(200).send(pantalla);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const postPantalla = async (req, res) => {
  try {
    const { codigo, nombre, app } = req.body;

    if (!codigo || !nombre || !app) {
      return res.status(400).send({ message: "codigo, nombre y app son obligatorios" });
    }
    if (!["adm", "mobile"].includes(app)) {
      return res.status(400).send({ message: "app debe ser 'adm' o 'mobile'" });
    }

    const existente = await Pantalla.findOne({ where: { codigo } });
    if (existente) {
      return res.status(400).send({ message: "Ya existe una pantalla con ese codigo" });
    }

    const pantalla = await Pantalla.create({
      codigo,
      nombre,
      app,
      activo: req.body.activo === undefined ? true : req.body.activo
    });

    res.status(200).send({ message: "Pantalla creada correctamente", data: pantalla });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const putPantalla = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Pantalla.update(req.body, { where: { id } });

    if (num === 1) {
      res.status(200).send({ message: "Pantalla actualizada correctamente" });
    } else {
      res.status(400).send({ message: `No se puede actualizar la pantalla id=${id}.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deletePantalla = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Pantalla.destroy({ where: { id } });

    if (num === 1) {
      res.status(200).send({ message: "Pantalla eliminada correctamente" });
    } else {
      res.status(400).send({ message: `No se puede eliminar la pantalla id=${id}.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getPantallas,
  getPantalla,
  postPantalla,
  putPantalla,
  deletePantalla
};
