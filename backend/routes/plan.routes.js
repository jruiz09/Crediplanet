const { authJwt } = require("../middleware");
const controller = require("../controllers/plan.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/plan", [authJwt.verifyToken], controller.getPlan);
  app.post("/api/plan", [authJwt.verifyToken], controller.postPlan);
  app.put("/api/plan/:idplan", [authJwt.verifyToken], controller.putPlan);
  app.delete("/api/plan/:idplan", [authJwt.verifyToken], controller.deletePlan);  
};
