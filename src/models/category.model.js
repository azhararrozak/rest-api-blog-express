import mongoose from "mongoose";

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);

export default Category;
