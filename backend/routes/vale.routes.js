const { authJwt } = require("../middleware");
const controller = require("../controllers/vale.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/vale", [authJwt.verifyToken], controller.getVale);
  app.post("/api/vale", [authJwt.verifyToken], controller.postVale);
  app.put("/api/vale/:idvale", [authJwt.verifyToken], controller.putVale);
  app.delete("/api/vale/:idcliente", [authJwt.verifyToken], controller.deleteVale);  
};
