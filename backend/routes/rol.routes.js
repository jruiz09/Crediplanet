const { authJwt } = require("../middleware");
const { requierePermiso } = require("../services/permisos.service");
const controller = require("../controllers/rol.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/roles", [authJwt.verifyToken], controller.getRoles);
  app.get("/api/roles/:id", [authJwt.verifyToken], controller.getRol);
  app.post("/api/roles", [authJwt.verifyToken, requierePermiso("ROLES", "adm")], controller.postRol);
  app.put("/api/roles/:id", [authJwt.verifyToken, requierePermiso("ROLES", "adm")], controller.putRol);
  app.delete("/api/roles/:id", [authJwt.verifyToken, requierePermiso("ROLES", "adm")], controller.deleteRol);
  app.put("/api/roles/:id/pantallas", [authJwt.verifyToken, requierePermiso("ROLES", "adm")], controller.setPantallasRol);
};
