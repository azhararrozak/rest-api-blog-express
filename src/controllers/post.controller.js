const db = require("../models");
const Post = db.post;

// Create and Save a new Post
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({ message: "Title can not be empty!" });
      return;
    }

    // Create a Post
    const post = new Post({
      author: req.body.author,
      title: req.body.title,
      content: req.body.content,
      categories: req.body.category,
    });

    // Save Post in the database
    await post.save(post);
    res.send(post);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Retrieve all Posts from the database.
exports.findAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("category", "-__v");
    res.send(posts);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Find a single Post with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).populate("category", "-__v");

    if (!post) res.status(404).send({ message: "Not found Post with id " + id });
    else res.send(post);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update a Post by the id in the request
exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Data to update can not be empty!" });
    }

    const id = req.params.id;

    await Post.findByIdAndUpdate(id, req.body, { useFindAndModify: false });

    const post = await Post.findById(id);

    if (!post) res.status(404).send({ message: "Not found Post with id " + id });
    else res.send(post);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete a Post with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Post.findByIdAndRemove(id);

    res.send({ message: "Post was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
