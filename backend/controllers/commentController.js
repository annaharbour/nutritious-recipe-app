const { check, validationResult } = require("express-validator");
const Comment = require("../models/CommentModel");
const User = require("../models/UserModel");

const createComment = async (req, res) => {
	const recipe = req.params.recipeId;
	const userId = req.user.id;
	const { text } = req.body;

	const validateInputs = [
		check("recipe", "Recipe ID is required").notEmpty(),
		check("user", "User ID is required").notEmpty(),
		check("text", "Text is required").notEmpty(),
	];
	validateInputs.forEach((validation) => validation.run(req));
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await User.findById(userId).select("-password");
		const newComment = new Comment({
			text,
			user,
			recipe,
		});
		const comment = await newComment.save();
		return res.json(comment);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server error");
	}
};

const getCommentsByRecipeId = async (req, res) => {
	const recipeId = req.params.recipeId;

	try {
		const comments = await Comment.find({ recipe: recipeId }).sort({
			date: -1,
		});

		return res.json(comments);
	} catch (err) {
		return res.status(500).send("Server Error");
	}
};

const getCommentById = async (req, res) => {
	const commentId = req.params.commentId;
	try {
		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ msg: "Comment not found" });
		}
		return res.json(comment);
	} catch (err) {
		return res.status(500).send("Server Error");
	}
};

const deleteCommentById = async (req, res) => {
	const commentId = req.params.commentId;
	try {
		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ msg: "Comment not found" });
		}
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}
		await Comment.deleteOne(comment);
		return res.json({ msg: "Comment removed" });
	} catch (err) {
		return res.status(500).send("Server Error");
	}
};

const toggleLikeComment = async (req, res) => {
	const commentId = req.params.commentId;
	try {
		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ msg: "Comment not found" });
		}

		const alreadyLikedIndex = comment.likes.findIndex(
			(like) => like.user.toString() === req.user.id
		);

		if (alreadyLikedIndex !== -1) {
			comment.likes.splice(alreadyLikedIndex, 1);
			await comment.save();
			return res.json(comment.likes);
		} else {
			comment.likes.unshift({ user: req.user.id });
			await comment.save();
			return res.json(comment.likes);
		}
	} catch (err) {
		return res.status(500).send("Server Error");
	}
};

const respondToComment = async (req, res) => {
    const commentId = req.params.commentId;

	const { text } = req.body;
	
    const validateInputs = [
		check("text", "Text is required").notEmpty()	];
	validateInputs.forEach((validation) => validation.run(req));
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}


	try {
		const user = await User.findById(req.user.id).select("-password");
		const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }
		const newResponse = {
			text,
			name: user.name,
			user: user,
			comment: commentId,
		};

        console.log(newResponse);
		comment.responses.unshift(newResponse);

		await comment.save();

		return res.json(comment.responses);
	} catch (err) {
        console.error(err.message);
		return res.status(500).send("Server Error");
	}
};

const getResponse = async (req, res) => {
    const responseId = req.params.responseId;
    try {
        const comment = await Comment.findOne({ "responses._id": responseId });
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }
        const response = comment.responses.find(
            (response) => response.id === responseId
        );
        if (!response) {
            return res.status(404).json({ msg: "Response not found" });
        }
        return res.json(response);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
}

const deleteResponse = async (req, res) => {
	const responseId = req.params.responseId;
    console.log(responseId)
	try {
		const comment = await Comment.findOne({ "responses._id": responseId});
		if (!comment) {
			return res.status(404).json({ msg: "Comment not found" });
		}
		const response = comment.responses.find(
			(response) => response.id === responseId
		);
		if (!response) {
			return res.status(404).json({ msg: "Response not found" });
		}
		if (response.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}
		 comment.responses = comment.responses.filter(({ id }) => id !== responseId);

		 await comment.save();

		 return res.json(comment.responses);
	} catch (err) {
        console.error(err.message);
		return res.status(500).send("Server Error");
	}
};

module.exports = {
	createComment,
	getCommentsByRecipeId,
	getCommentById,
	deleteCommentById,
	toggleLikeComment,
	respondToComment,
    getResponse,
	deleteResponse,
};
