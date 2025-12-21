import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "../models/index.js";

dotenv.config();

const Post = db.post;
const Category = db.category;
const User = db.user;

describe("Model Integration Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("Post Model", () => {
    test("should have required fields", async () => {
      const posts = await Post.find().limit(1);

      if (posts.length > 0) {
        const post = posts[0];
        expect(post.title).toBeDefined();
        expect(post.slug).toBeDefined();
        expect(post.content).toBeDefined();
        expect(post.created_at).toBeDefined();
        expect(post.updated_at).toBeDefined();
      }
    });

    test("should populate author reference", async () => {
      const post = await Post.findOne().populate("author");

      if (post && post.author) {
        expect(post.author.username).toBeDefined();
        expect(post.author.email).toBeDefined();
      }
    });

    test("should populate categories reference", async () => {
      const post = await Post.findOne().populate("categories");

      if (post && post.categories) {
        expect(post.categories.name).toBeDefined();
        expect(post.categories.slug).toBeDefined();
      }
    });
  });

  describe("Category Model", () => {
    test("should have required fields", async () => {
      const categories = await Category.find().limit(1);

      if (categories.length > 0) {
        const category = categories[0];
        expect(category.name).toBeDefined();
        expect(category.slug).toBeDefined();
        expect(category.createdAt).toBeDefined();
        expect(category.updatedAt).toBeDefined();
      }
    });

    test("should have unique names", async () => {
      const categories = await Category.find();
      const names = categories.map((cat) => cat.name);
      const uniqueNames = new Set(names);

      expect(names.length).toBe(uniqueNames.size);
    });
  });

  describe("User Model", () => {
    test("should have required fields", async () => {
      const users = await User.find().limit(1);

      if (users.length > 0) {
        const user = users[0];
        expect(user.username).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.password).toBeDefined();
      }
    });

    test("should have roles reference", async () => {
      const user = await User.findOne().populate("roles");

      if (user && user.roles) {
        expect(Array.isArray(user.roles)).toBe(true);
        if (user.roles.length > 0) {
          expect(user.roles[0].name).toBeDefined();
        }
      }
    });
  });

  describe("Database Relationships", () => {
    test("posts should reference valid users", async () => {
      const posts = await Post.find({ author: { $ne: null } }).populate(
        "author"
      );

      posts.forEach((post) => {
        if (post.author) {
          expect(post.author._id).toBeDefined();
        }
      });
    });

    test("posts should reference valid categories", async () => {
      const posts = await Post.find({ categories: { $ne: null } }).populate(
        "categories"
      );

      posts.forEach((post) => {
        if (post.categories) {
          expect(post.categories._id).toBeDefined();
        }
      });
    });

    test("should find posts by category slug", async () => {
      const category = await Category.findOne({ slug: "technology" });

      if (category) {
        const posts = await Post.find({ categories: category._id });
        expect(Array.isArray(posts)).toBe(true);
      }
    });
  });
});
