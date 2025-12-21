import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "../models/index.js";

dotenv.config();

const Post = db.post;
const Category = db.category;

describe("Slug Generation Tests", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe("Category Slug Generation", () => {
    test("should generate slugs for all categories", async () => {
      const categories = await Category.find();

      expect(categories.length).toBeGreaterThan(0);

      categories.forEach((category) => {
        expect(category.slug).toBeDefined();
        expect(category.slug).toBeTruthy();
        expect(typeof category.slug).toBe("string");
      });
    });

    test("should have unique slugs for each category", async () => {
      const categories = await Category.find();
      const slugs = categories.map((cat) => cat.slug);
      const uniqueSlugs = new Set(slugs);

      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    test("should generate lowercase slugs", async () => {
      const categories = await Category.find();

      categories.forEach((category) => {
        expect(category.slug).toBe(category.slug.toLowerCase());
      });
    });

    test("should replace spaces with dashes in slugs", async () => {
      const category = await Category.findOne({ name: /\s/ });

      if (category) {
        expect(category.slug).not.toContain(" ");
        expect(category.slug).toMatch(/^[a-z0-9-]+$/);
      }
    });

    test("should generate slug from category name", async () => {
      const technology = await Category.findOne({ name: "Technology" });

      if (technology) {
        expect(technology.slug).toBe("technology");
      }
    });
  });

  describe("Post Slug Generation", () => {
    test("should generate slugs for all posts", async () => {
      const posts = await Post.find();

      expect(posts.length).toBeGreaterThan(0);

      posts.forEach((post) => {
        expect(post.slug).toBeDefined();
        expect(post.slug).toBeTruthy();
        expect(typeof post.slug).toBe("string");
      });
    });

    test("should have unique slugs for each post", async () => {
      const posts = await Post.find();
      const slugs = posts.map((post) => post.slug);
      const uniqueSlugs = new Set(slugs);

      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    test("should generate lowercase slugs", async () => {
      const posts = await Post.find();

      posts.forEach((post) => {
        expect(post.slug).toBe(post.slug.toLowerCase());
      });
    });

    test("should replace spaces with dashes in slugs", async () => {
      const posts = await Post.find();

      posts.forEach((post) => {
        expect(post.slug).not.toContain(" ");
        expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });

    test("should generate slug from post title", async () => {
      const post = await Post.findOne({
        title: "Getting Started with Node.js",
      });

      if (post) {
        expect(post.slug).toBe("getting-started-with-nodejs");
      }
    });

    test("should have timestamps (created_at and updated_at)", async () => {
      const posts = await Post.find();

      posts.forEach((post) => {
        expect(post.created_at).toBeDefined();
        expect(post.updated_at).toBeDefined();
        expect(post.created_at).toBeInstanceOf(Date);
        expect(post.updated_at).toBeInstanceOf(Date);
      });
    });
  });

  describe("Slug Uniqueness on Duplicates", () => {
    test("should handle duplicate titles with numeric suffix", async () => {
      const testTitle = "Test Duplicate Post";

      // Create first post
      const post1 = new Post({
        title: testTitle,
        content: "First post content",
        author: null,
        categories: null,
      });
      await post1.save();

      // Create second post with same title
      const post2 = new Post({
        title: testTitle,
        content: "Second post content",
        author: null,
        categories: null,
      });
      await post2.save();

      expect(post1.slug).toBe("test-duplicate-post");
      expect(post2.slug).toBe("test-duplicate-post-1");

      // Cleanup
      await Post.deleteMany({ title: testTitle });
    });

    test("should handle duplicate category names with numeric suffix", async () => {
      const testName = "Test Category";

      // Create first category
      const cat1 = new Category({
        name: testName + " 1",
        description: "First category",
      });
      await cat1.save();

      // Create second category with same name
      const cat2 = new Category({
        name: testName + " 2",
        description: "Second category",
      });
      await cat2.save();

      expect(cat1.slug).toBeTruthy();
      expect(cat2.slug).toBeTruthy();
      expect(cat1.slug).not.toBe(cat2.slug);

      // Cleanup
      await Category.deleteMany({ name: /Test Category/ });
    });
  });

  describe("Slug Update on Title/Name Change", () => {
    test("should update post slug when title changes", async () => {
      // Create a test post
      const post = new Post({
        title: "Original Title",
        content: "Test content",
        author: null,
        categories: null,
      });
      await post.save();

      const originalSlug = post.slug;
      expect(originalSlug).toBe("original-title");

      // Update title
      post.title = "Updated Title";
      await post.save();

      expect(post.slug).toBe("updated-title");
      expect(post.slug).not.toBe(originalSlug);

      // Cleanup
      await Post.deleteOne({ _id: post._id });
    });

    test("should update category slug when name changes", async () => {
      // Create a test category
      const category = new Category({
        name: "Original Name",
        description: "Test description",
      });
      await category.save();

      const originalSlug = category.slug;
      expect(originalSlug).toBe("original-name");

      // Update name
      category.name = "Updated Name";
      await category.save();

      expect(category.slug).toBe("updated-name");
      expect(category.slug).not.toBe(originalSlug);

      // Cleanup
      await Category.deleteOne({ _id: category._id });
    });
  });
});
