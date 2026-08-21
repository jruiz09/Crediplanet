const { authJwt } = require("../middleware");
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
  app.post("/api/pantallas", [authJwt.verifyToken, authJwt.isAdmin], controller.postPantalla);
  app.put("/api/pantallas/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.putPantalla);
  app.delete("/api/pantallas/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deletePantalla);
};
