const mongoose = require("mongoose");

const Post = mongoose.model(
    "Post",
    new mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        title: String,
        content: String,
        status: {
            type: String,
            default: "draft"
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    })
)

module.exports = Post;