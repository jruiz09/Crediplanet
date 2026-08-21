const { authJwt } = require("../middleware");
const controller = require("../controllers/nolaborales.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/nolaborales", [authJwt.verifyToken], controller.getDias);
  app.post("/api/nolaborales", [authJwt.verifyToken], controller.postDias);
  app.put("/api/nolaborales/:idnolaborales", [authJwt.verifyToken], controller.putDias);
  app.delete("/api/nolaborales/:idnolaborales", [authJwt.verifyToken], controller.deleteDias);
};
