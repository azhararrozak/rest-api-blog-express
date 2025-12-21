import db from "../models/index.js";

const Role = db.role;

const roles = [{ name: "user" }, { name: "admin" }];

export const seedRoles = async () => {
  try {
    const count = await Role.countDocuments();

    if (count > 0) {
      console.log("Roles already seeded. Skipping...");
      return;
    }

    await Role.insertMany(roles);
    console.log("Roles seeded successfully");
  } catch (error) {
    console.error("Error seeding roles:", error);
    throw error;
  }
};
