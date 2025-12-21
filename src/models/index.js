import mongoose from "mongoose";
import User from "./user.model.js";
import Role from "./role.model.js";
import RefreshToken from "./refreshtoken.model.js";
import Post from "./post.model.js";
import Category from "./category.model.js";
import Comment from "./comment.model.js";

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = User;
db.role = Role;
db.refreshToken = RefreshToken;
db.post = Post;
db.category = Category;
db.comment = Comment;


db.ROLES = ["user", "admin", "moderator"];

export default db;
