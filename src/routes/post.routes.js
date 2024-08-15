const { authJwt } = require("../middleware");
const controller = require("../controllers/post.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/post", [authJwt.verifyToken], controller.create);
  app.get("/api/post", [authJwt.verifyToken], controller.findAll);
  app.get("/api/post/:id", [authJwt.verifyToken], controller.findOne);
  app.put("/api/post/:id", [authJwt.verifyToken], controller.update);
  app.delete("/api/post/:id", [authJwt.verifyToken], controller.delete);
}