const { authJwt } = require("../middleware");
const controller = require("../controllers/gasto.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/gasto", [authJwt.verifyToken], controller.getGasto);
  app.get("/api/gastoresumen", [authJwt.verifyToken], controller.getGastoPorMes);
  app.post("/api/gasto", [authJwt.verifyToken], controller.postGasto);
  app.put("/api/gasto/:idgasto", [authJwt.verifyToken], controller.putGasto);
  app.delete("/api/gasto/:idgasto", [authJwt.verifyToken], controller.deleteGasto);  
};
