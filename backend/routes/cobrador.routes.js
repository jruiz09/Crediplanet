const { authJwt } = require("../middleware");
const controller = require("../controllers/cobrador.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/cobrador", [authJwt.verifyToken], controller.getCobrador);
  app.get("/api/cobrador/:idempresa", [authJwt.verifyToken], controller.getCobradorxEmpresa);
  app.post("/api/cobrador", [authJwt.verifyToken], controller.postCobrador);
  app.put("/api/cobrador/:idcobrador", [authJwt.verifyToken], controller.putCobrador);
  app.delete("/api/cobrador/:idcobrador", [authJwt.verifyToken], controller.deleteCobrador);  
};
