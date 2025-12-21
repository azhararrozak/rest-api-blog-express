import { authJwt } from "../middleware/index.js";
import * as controller from "../controllers/comment.controller.js";

export default function (app) {
    app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/comment", [authJwt.verifyToken], controller.create);
  app.get("/api/comment", controller.findAll);
  app.get("/api/comment/:id", controller.findOne);
  app.put("/api/comment/:id", [authJwt.verifyToken], controller.update);
  app.delete("/api/comment/:id", [authJwt.verifyToken], controller.remove);
}