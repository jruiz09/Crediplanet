const db = require("../models");

// controllers/notificacionController.js
const obtenerNotificaciones = async (req, res) => {
  try {
    const notificaciones = await db.Notificacion.findAll({
      order: [["fecha", "DESC"]],
      limit: 20
    });
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

const obtenerNotificacionesxCobrador = async (req, res) => {
  const cobrador = req.params.idcobrador
  try {
    const notificaciones = await db.Notificacion.findAll({
      where: [{idcobrador : cobrador} ],
      order: [["fecha", "DESC"]],
      limit: 20
    });
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

const marcarComoLeidas = async (req, res) => {
  try {
    await db.Notificacion.update({ leida: true }, { where: { leida: false } });
    res.json({ message: "Notificaciones marcadas como leídas" });
  } catch (error) {
    console.error("Error al marcar como leídas:", error);
    res.status(500).json({ message: "Error al actualizar notificaciones" });
  }
};


const marcarUnaComoLeida = async (req, res) => {
  const { id } = req.params;
  try {
    const notificacion = await db.Notificacion.findByPk(id);
    if (!notificacion) return res.status(404).json({ message: "No encontrada" });

    notificacion.leida = true;
    await notificacion.save();

    res.json({ message: "Notificación marcada como leída" });
  } catch (err) {
    res.status(500).json({ message: "Error al marcar como leída" });
  }
};

module.exports = {
  obtenerNotificaciones,
  marcarComoLeidas,
  marcarUnaComoLeida,
  obtenerNotificacionesxCobrador
};
