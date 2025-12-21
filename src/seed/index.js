import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedRoles } from "./role.seed.js";
import { seedUsers } from "./user.seed.js";
import { seedCategories } from "./category.seed.js";
import { seedPosts } from "./post.seed.js";

dotenv.config();

const runSeeds = async () => {
  try {
    console.log("Starting database seeding...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");

    // Run seeds in order (because of dependencies)
    await seedRoles();
    await seedUsers();
    await seedCategories();
    await seedPosts();

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\nError during seeding:", error);
    process.exit(1);
  }
};

runSeeds();
