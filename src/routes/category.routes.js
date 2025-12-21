import { authJwt } from "../middleware/index.js";
import * as controller from "../controllers/category.controller.js";

export default function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/category", [authJwt.verifyToken], controller.create);
  app.get("/api/category", controller.findAll);
  app.get("/api/category/slug/:slug", controller.findBySlug);
  app.get("/api/category/:id", controller.findOne);
  app.put("/api/category/:id", [authJwt.verifyToken], controller.update);
  app.delete("/api/category/:id", [authJwt.verifyToken], controller.remove);
}
