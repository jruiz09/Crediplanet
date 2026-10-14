const { authJwt } = require("../middleware");
const { requierePermiso } = require("../services/permisos.service");
const controller = require("../controllers/pantalla.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/pantallas", [authJwt.verifyToken], controller.getPantallas);
  app.get("/api/pantallas/:id", [authJwt.verifyToken], controller.getPantalla);
  app.post("/api/pantallas", [authJwt.verifyToken, requierePermiso("PANTALLAS", "adm")], controller.postPantalla);
  app.put("/api/pantallas/:id", [authJwt.verifyToken, requierePermiso("PANTALLAS", "adm")], controller.putPantalla);
  app.delete("/api/pantallas/:id", [authJwt.verifyToken, requierePermiso("PANTALLAS", "adm")], controller.deletePantalla);
};
