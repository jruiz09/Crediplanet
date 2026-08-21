const { authJwt } = require("../middleware");
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
  app.post("/api/roles", [authJwt.verifyToken, authJwt.isAdmin], controller.postRol);
  app.put("/api/roles/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.putRol);
  app.delete("/api/roles/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteRol);
  app.put("/api/roles/:id/pantallas", [authJwt.verifyToken, authJwt.isAdmin], controller.setPantallasRol);
};
