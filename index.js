import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "./src/models/index.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Role = db.role;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

authRoutes(app);
userRoutes(app);
postRoutes(app);
categoryRoutes(app);

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      await new Role({
        name: "user",
      }).save();

      await new Role({
        name: "admin",
      }).save();

      console.log("Added 'user' and 'admin' to roles collection");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
