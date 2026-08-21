const { authJwt } = require("../middleware");
const controller = require("../controllers/empresa.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/empresa", [authJwt.verifyToken], controller.getEmpresa);
  app.post("/api/empresa", [authJwt.verifyToken], controller.postEmpresa);

};
