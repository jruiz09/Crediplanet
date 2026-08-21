const { authJwt } = require("../middleware");
const controller = require("../controllers/pagocobradores.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/pagocobradores" , controller.getPagoCobradores);
  app.post("/api/pagocobradores" , controller.postPagoCobradores);
};
