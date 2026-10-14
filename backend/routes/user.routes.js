const { authJwt } = require("../middleware");
const { requierePermiso } = require("../services/permisos.service");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/usuarios", [authJwt.verifyToken, requierePermiso("USUARIOS", "adm")], controller.postUsuario);
  app.get("/api/usuarios", [authJwt.verifyToken, requierePermiso("USUARIOS", "adm")], controller.getUsuarios);
  app.get("/api/usuarios/:id", [authJwt.verifyToken, requierePermiso("USUARIOS", "adm")], controller.getUsuario);
  app.put("/api/usuarios/:id", [authJwt.verifyToken, requierePermiso("USUARIOS", "adm")], controller.putUsuario);
  app.put("/api/usuarios/:id/roles", [authJwt.verifyToken, requierePermiso("USUARIOS", "adm")], controller.setRolesUsuario);

  app.get("/api/test/all", [authJwt.verifyToken], controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
