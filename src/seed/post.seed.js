import db from "../models/index.js";

const Post = db.post;
const User = db.user;
const Category = db.category;

const posts = [
  {
    title: "Getting Started with Node.js",
    content:
      "Node.js is a powerful JavaScript runtime built on Chrome's V8 JavaScript engine. In this comprehensive guide, we'll explore how to get started with Node.js development, from installation to building your first application. Node.js allows developers to use JavaScript for server-side programming, making it possible to build scalable and efficient web applications.",
    categoryName: "Technology",
    authorEmail: "john@example.com",
  },
  {
    title: "Top 10 Travel Destinations for 2025",
    content:
      "Discover the most amazing travel destinations to visit in 2025. From exotic beaches to historic cities, we've compiled a list of must-visit places around the world. Whether you're seeking adventure, relaxation, or cultural experiences, these destinations offer something special for every type of traveler.",
    categoryName: "Travel",
    authorEmail: "jane@example.com",
  },
  {
    title: "Healthy Eating Habits for a Better Life",
    content:
      "Learn about the importance of maintaining healthy eating habits and how they can improve your overall well-being. This article covers essential nutrition tips, meal planning strategies, and the science behind healthy food choices. Discover how small changes in your diet can lead to significant improvements in your health.",
    categoryName: "Health",
    authorEmail: "moderator@example.com",
  },
  {
    title: "The Ultimate Guide to MongoDB",
    content:
      "MongoDB is a popular NoSQL database that offers flexibility and scalability for modern applications. In this guide, we'll dive deep into MongoDB's features, best practices, and how to effectively use it in your projects. Learn about document-oriented storage, indexing strategies, and query optimization.",
    categoryName: "Technology",
    authorEmail: "admin@example.com",
  },
  {
    title: "Delicious Italian Pasta Recipes",
    content:
      "Explore authentic Italian pasta recipes that will transport your taste buds to Italy. From classic carbonara to innovative modern dishes, learn the secrets of perfect pasta preparation. We'll cover traditional techniques, ingredient selection, and tips from Italian chefs to help you create restaurant-quality pasta at home.",
    categoryName: "Food",
    authorEmail: "jane@example.com",
  },
  {
    title: "Building a Successful Startup",
    content:
      "Insights and strategies for building a successful startup from scratch. Learn from experienced entrepreneurs about common pitfalls to avoid, fundraising strategies, team building, and scaling your business. This comprehensive guide covers everything from idea validation to achieving product-market fit.",
    categoryName: "Business",
    authorEmail: "admin@example.com",
  },
  {
    title: "Mindfulness and Meditation Techniques",
    content:
      "Discover the power of mindfulness and meditation in reducing stress and improving mental clarity. This article explores various meditation techniques, their benefits, and how to incorporate them into your daily routine. Learn practical tips for beginners and advanced practitioners alike.",
    categoryName: "Lifestyle",
    authorEmail: "moderator@example.com",
  },
  {
    title: "JavaScript ES6 Features You Should Know",
    content:
      "ES6 introduced many powerful features to JavaScript that have transformed how we write code. From arrow functions to promises, destructuring to template literals, this guide covers essential ES6 features with practical examples. Master modern JavaScript and write cleaner, more efficient code.",
    categoryName: "Technology",
    authorEmail: "john@example.com",
  },
];

export const seedPosts = async () => {
  try {
    const count = await Post.countDocuments();

    if (count > 0) {
      console.log("Posts already seeded. Skipping...");
      return;
    }

    const users = await User.find().populate("roles");
    const categories = await Category.find();

    const userMap = {};
    users.forEach((user) => {
      userMap[user.email] = user._id;
    });

    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.name] = category._id;
    });

    // Save individually to trigger pre-save hook for slug generation
    for (const postData of posts) {
      const post = new Post({
        title: postData.title,
        content: postData.content,
        author: userMap[postData.authorEmail],
        categories: categoryMap[postData.categoryName],
        created_at: new Date(),
      });
      await post.save();
    }

    console.log("✅ Posts seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding posts:", error);
    throw error;
  }
};