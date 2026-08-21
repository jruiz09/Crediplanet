const permisosService = require("../services/permisos.service");

const check = async (req, res) => {
  try {
    const { codigoPantalla, app } = req.query;
    if (!codigoPantalla || !app) {
      return res.status(400).send({ message: "codigoPantalla y app son obligatorios" });
    }

    const tienePermiso = await permisosService.tienePermiso(req.userId, codigoPantalla, app);
    res.status(200).send({ tienePermiso });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const menu = async (req, res) => {
  try {
    const { app } = req.query;
    if (!app) {
      return res.status(400).send({ message: "app es obligatorio" });
    }

    const pantallas = await permisosService.getMenu(req.userId, app);
    res.status(200).send(pantallas);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  check,
  menu
};
