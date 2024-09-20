const mongoose = require("mongoose");
const { category } = require(".");

const Post = mongoose.model(
    "Post",
    new mongoose.Schema({
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        categories: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        title: String,
        content: String,
        created_at: {
            type: Date,
            default: Date.now
        },
    })
)

module.exports = Post;