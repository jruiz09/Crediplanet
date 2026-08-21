const { authJwt } = require("../middleware");
const controller = require("../controllers/caja.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/caja", [authJwt.verifyToken], controller.getCaja);
  app.get("/api/cajaresumen", controller.getResumenCaja);
  app.post("/api/caja", [authJwt.verifyToken], controller.postCaja);
};
