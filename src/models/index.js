 const mongoose = require("mongoose");
 mongoose.Promise = global.Promise;

 const db = {};

 db.mongoose = mongoose;

 db.user = require("./user.model");
 db.role = require("./role.model");
 db.refreshToken = require("./refreshtoken.model"); 
 db.post = require("./post.model");
 db.category = require("./category.model");

 db.ROLES = ["user", "admin"];

 module.exports = db;
