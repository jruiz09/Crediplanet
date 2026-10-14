const { authJwt } = require("../middleware");
const controller = require("../controllers/cliente.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/cliente", [authJwt.verifyToken],  controller.getCliente);
  app.get("/api/clientesmorosos", [authJwt.verifyToken], controller.getClientesMorosos);
  app.get("/api/cliente/:idempresa", [authJwt.verifyToken], controller.getClientexEmpresa);
  app.get("/api/cliente/resumenclienteestado/:idcliente", controller.getResumenClienteEstado);
  app.get("/api/cliente/resumenclienteultimoscreditosdetalles/:idcliente", controller.getResumenClienteUltimosCreditosDetalles);
  app.get("/api/cliente/resumenclienteultimoscreditos/:idcliente", controller.getResumenClienteUltimosCreditos);
  app.get("/api/cliente/refinanciado/:idcliente", controller.getRefinanciado);
  app.get("/api/cliente/creditosrefinanciados/:idcliente", [authJwt.verifyToken], controller.getCreditosRefinanciados);
  app.post("/api/cliente", [authJwt.verifyToken],  controller.upload, controller.postCliente);
  app.put("/api/cliente/:idcliente", [authJwt.verifyToken], controller.upload, controller.putCliente);
  app.delete("/api/cliente/:idcliente", [authJwt.verifyToken], controller.deleteCliente);  
};
