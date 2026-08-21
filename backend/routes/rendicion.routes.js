const { authJwt } = require("../middleware");
const controller = require("../controllers/rendicion.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/rendicion/rendiciondiaria", controller.getRendicionDiaria);
  app.post("/api/rendicion/rendicionsemanal", [authJwt.verifyToken], controller.getRendicionSemanal);
  app.post("/api/rendicion/rendicionporcobrador", controller.getRendicionPorCobrador);
  app.post("/api/rendicion/rendicionporcobradordetalle", controller.getRendicionPorCobradorDetalles);
  
};
