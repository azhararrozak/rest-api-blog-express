import db from "../models/index.js";

const Comment = db.comment;

export const create = async (req, res) => {
    try {
        if (!req.body.content) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
        }

        const comment = new Comment({
            postId: req.body.postId,
            content: req.body.content,
            author: req.body.author,
        });

        await comment.save(comment);
        res.send(comment);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const findAll = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.send(comments);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findById(id);

        if (!comment)
            res.status(404).send({ message: "Not found Comment with id " + id });
        else res.send(comment);
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
        const comment = await Comment.findByIdAndUpdate(id, req.body, {
            useFindAndModify: false,
        });

        if (!comment) {
            res.status(404).send({ message: `Cannot update Comment with id=${id}. Maybe Comment was not found!` });
        } else res.send({ message: "Comment was updated successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            res.status(404).send({ message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!` });
        } else {
            res.send({ message: "Comment was deleted successfully!" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

