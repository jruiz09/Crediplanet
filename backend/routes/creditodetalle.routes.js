const { authJwt } = require("../middleware");
const controller = require("../controllers/creditodetalle.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/creditodetalle", [authJwt.verifyToken], controller.getDetalles);
  app.get("/api/creditodetalle/:idcredito", [authJwt.verifyToken], controller.getDetallesxCredito);
  app.post("/api/creditodetalle/nuevacuota",  controller.PostCuotaAdicional);
 app.post("/api/creditodetalle/refinanciar/:idcredito",  controller.refinanciarCredito);
  app.put("/api/creditodetalle/pagocuota/:idcreditodetalle", controller.PagoCuota);
  app.put("/api/creditodetalle/pagocuotamobile/:idcreditodetalle", controller.PagoCuotaMobile);
  app.delete("/api/creditodetalle/:idcreditodetalle",  controller.deleteCuota);

  

};
