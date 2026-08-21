const db = require("../models");
const User = db.user;
const Cobrador = db.Cobrador;
const Pantalla = db.Pantalla;

const puedeAccederApp = async (user, app) => {
  if (app !== "mobile") return true;

  if (!user.idcobrador) return false;

  const cobrador = await Cobrador.findByPk(user.idcobrador);
  return !!(cobrador && cobrador.activo);
};

const tienePermiso = async (usuarioId, codigoPantalla, app) => {
  if (!usuarioId || !codigoPantalla || !app) return false;

  const user = await User.findByPk(usuarioId);
  if (!user) return false;

  if (!(await puedeAccederApp(user, app))) return false;

  const roles = await user.getRoles({
    include: [{
      model: Pantalla,
      where: { codigo: codigoPantalla, app, activo: true },
      through: { attributes: [] }
    }]
  });

  return roles.length > 0;
};

const getMenu = async (usuarioId, app) => {
  if (!usuarioId || !app) return [];

  const user = await User.findByPk(usuarioId);
  if (!user) return [];

  if (!(await puedeAccederApp(user, app))) return [];

  const roles = await user.getRoles({
    include: [{
      model: Pantalla,
      where: { app, activo: true },
      through: { attributes: [] }
    }]
  });

  const pantallasPorCodigo = new Map();
  roles.forEach((rol) => {
    (rol.pantallas || []).forEach((pantalla) => {
      pantallasPorCodigo.set(pantalla.codigo, {
        codigo: pantalla.codigo,
        nombre: pantalla.nombre
      });
    });
  });

  return Array.from(pantallasPorCodigo.values());
};

const requierePermiso = (codigoPantalla, app) => {
  return async (req, res, next) => {
    try {
      const permitido = await tienePermiso(req.userId, codigoPantalla, app);
      if (!permitido) {
        return res.status(403).send({
          message: "No tiene permiso para acceder a esta pantalla."
        });
      }
      next();
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };
};

module.exports = {
  tienePermiso,
  getMenu,
  requierePermiso
};
