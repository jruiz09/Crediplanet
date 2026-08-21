const { authJwt } = require("../middleware");
const controller = require("../controllers/credito.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/credito", [authJwt.verifyToken], controller.getCreditos);
  app.get("/api/credito/mobile/:idcredito/:idcobrador", controller.getCreditosMobile);
  app.get("/api/credito/resumen/:idcredito", [authJwt.verifyToken], controller.getResumenCredito);
  app.get("/api/credito/rendicionproductividadactual", controller.getRendicionProductividadActual);
  app.get("/api/credito/rendicionproductividadsemanal", controller.getRendicionProductividadSemanal);
  app.get("/api/credito/resumencreditos", controller.getResumenCreditos);
  app.get("/api/credito/resumencreditosdetalles", controller.getResumenCreditosDetalles);
  app.get("/api/credito/resumenmensualcreditos", controller.getResumenCreditosMensual);
  app.get("/api/credito/creditossemanales", controller.getCreditosSemanales);
  app.get("/api/credito/creditossemanalesdetalles", controller.getCreditosSemanalesDetalles);
  app.get("/api/credito/rendicion/:idcobrador", controller.getRendicion);
  app.get("/api/credito/rendido/:idcobrador", controller.getRendido);
  app.post("/api/credito", controller.postCreditos);
  app.delete("/api/credito/:idcredito", controller.deleteCredito);  
  app.get("/api/credito/mobilecuotas/:idcobrador", controller.getCuotasDiaxCobrador);
  app.get("/api/credito/mobilecuotaspendientes/:idcobrador", controller.getCuotasPendientesxCobrador);
  app.get("/api/credito/mobilecierre/:cobrador", controller.getCierreDia);

};

