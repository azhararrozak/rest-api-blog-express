import bcrypt from "bcryptjs";
import db from "../models/index.js";

const User = db.user;
const Role = db.role;

const users = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    roleName: "admin",
  },
  {
    username: "john_doe",
    email: "john@example.com",
    password: "user123",
    roleName: "user",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "user123",
    roleName: "user",
  },
];

export const seedUsers = async () => {
  try {
    const count = await User.countDocuments();

    if (count > 0) {
      console.log("Users already seeded. Skipping...");
      return;
    }

    const roles = await Role.find();
    const roleMap = {};
    roles.forEach((role) => {
      roleMap[role.name] = role._id;
    });

    const usersToInsert = users.map((user) => ({
      username: user.username,
      email: user.email,
      password: bcrypt.hashSync(user.password, 8),
      roles: [roleMap[user.roleName]],
    }));

    await User.insertMany(usersToInsert);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
};
