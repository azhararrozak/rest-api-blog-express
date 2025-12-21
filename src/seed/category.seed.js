import db from "../models/index.js";

const Category = db.category;

const categories = [
  {
    name: "Technology",
    description:
      "Posts about technology, programming, and software development",
  },
  {
    name: "Travel",
    description: "Travel guides, tips, and destination reviews",
  },
  {
    name: "Food",
    description: "Recipes, restaurant reviews, and culinary adventures",
  },
  {
    name: "Health",
    description: "Health tips, fitness guides, and wellness articles",
  },
  {
    name: "Lifestyle",
    description: "Lifestyle tips, personal development, and daily inspiration",
  },
  {
    name: "Business",
    description: "Business strategies, entrepreneurship, and career advice",
  },
];

export const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();

    if (count > 0) {
      console.log("Categories already seeded. Skipping...");
      return;
    }

    // Save individually to trigger pre-save hook for slug generation
    for (const categoryData of categories) {
      const category = new Category(categoryData);
      await category.save();
    }

    console.log("✅ Categories seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
};
