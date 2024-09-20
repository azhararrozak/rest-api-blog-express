const db = require("../models");
const Category = db.category;

exports.create = async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        });

        await category.save(category);
        res.send(category);
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}

exports.findAll = async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);

        if(!category) res.status(404).send({ message: "Not found Category with id " + id });
        else res.send(category);
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}

exports.update = async (req, res) => {
    try {
        if(!req.body){
            return res.status(400).send({ message: "Data to update can not be empty!" });
        }

        const id = req.params.id;
        await Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        res.send({ message: "Category was updated successfully!" });
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Category.findByIdAndRemove(id);
        res.send({ message: "Category was deleted successfully!" });
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}
