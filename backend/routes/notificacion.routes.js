const { authJwt } = require("../middleware");
const controller = require("../controllers/notificacion.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/notificaciones",  controller.obtenerNotificaciones);
  app.get("/api/notificaciones/:idcobrador",  controller.obtenerNotificacionesxCobrador);
  app.put("/api/notificaciones/leidas",  controller.marcarComoLeidas);
  app.put("/api/notificaciones/:id/leida", controller.marcarUnaComoLeida);

};

