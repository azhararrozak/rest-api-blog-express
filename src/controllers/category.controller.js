import db from "../models/index.js";

const Category = db.category;

export const create = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    await category.save(category);
    res.send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const findAll = async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);

    if (!category)
      res.status(404).send({ message: "Not found Category with id " + id });
    else res.send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Find a single Category by slug
export const findBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const category = await Category.findOne({ slug });

    if (!category)
      res.status(404).send({ message: "Not found Category with slug " + slug });
    else res.send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .send({ message: "Data to update can not be empty!" });
    }

    const id = req.params.id;
    await Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
    res.send({ message: "Category was updated successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await Category.findOneAndDelete(id);
    res.send({ message: "Category was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
