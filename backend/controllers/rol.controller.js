const db = require("../models");
const Role = db.role;
const Pantalla = db.Pantalla;

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{ model: Pantalla, through: { attributes: [] } }],
      order: [["id", "ASC"]]
    });
    res.status(200).send(roles);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getRol = async (req, res) => {
  try {
    const rol = await Role.findByPk(req.params.id, {
      include: [{ model: Pantalla, through: { attributes: [] } }]
    });
    if (!rol) {
      return res.status(404).send({ message: "Rol no encontrado" });
    }
    res.status(200).send(rol);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const postRol = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "name es obligatorio" });
    }

    const rol = await Role.create({ name });
    res.status(200).send({ message: "Rol creado correctamente", data: rol });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const putRol = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Role.update(req.body, { where: { id } });

    if (num === 1) {
      res.status(200).send({ message: "Rol actualizado correctamente" });
    } else {
      res.status(400).send({ message: `No se puede actualizar el rol id=${id}.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteRol = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Role.destroy({ where: { id } });

    if (num === 1) {
      res.status(200).send({ message: "Rol eliminado correctamente" });
    } else {
      res.status(400).send({ message: `No se puede eliminar el rol id=${id}.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const setPantallasRol = async (req, res) => {
  try {
    const id = req.params.id;
    const { pantallaIds } = req.body;

    if (!Array.isArray(pantallaIds)) {
      return res.status(400).send({ message: "pantallaIds debe ser un array" });
    }

    const rol = await Role.findByPk(id);
    if (!rol) {
      return res.status(404).send({ message: "Rol no encontrado" });
    }

    await rol.setPantallas(pantallaIds);
    res.status(200).send({ message: "Pantallas del rol actualizadas correctamente" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getRoles,
  getRol,
  postRol,
  putRol,
  deleteRol,
  setPantallasRol
};
