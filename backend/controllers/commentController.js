const { check, validationResult } = require("express-validator");
const Comment = require("../models/CommentModel");
const User = require("../models/UserModel");
const Recipe = require("../models/RecipeModel");

const createComment = async (req, res) => {
	const recipe = req.params.recipeId;
	const userId = req.user.id;
	const { text } = req.body;
	try {
		const user = await User.findById(userId).select("-password");
		const userName = user.name;
		const newComment = new Comment({
			text,
			user: user._id,
			userName,
			recipe,
		});
		await newComment.save();
		const comments = await Comment.find({ recipe }).sort({ date: 1 });
		return res.status(200).json(comments);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server error");
	}
};

const getCommentsByRecipeId = async (req, res) => {
	const recipeId = req.params.recipeId;

	try {
		const recipe = await Recipe.findById(recipeId);
		if (!recipe) {
			return res.status(404).json({ msg: "Recipe not found" });
		}

		const comments = await Comment.find({ recipe: recipeId }).sort({
			date: 1,
		});

		return res.status(200).json(comments);
	} catch (err) {
		return res.status(500).send("Server Error");
	}
};

const getCommentById = async (req, res) => {
	try {
		const commentId = req.params.commentId;
		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ msg: "Comment not found" });
		}
		return res.status(200).json(comment);
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
		await Comment.findByIdAndDelete(commentId);

		const comments = await Comment.find({ recipe: comment.recipe }).sort({
			date: 1,
		});
		return res.status(200).json(comments);
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
			return res.status(200).json(comment);
		} else {
			comment.likes.unshift({ user: req.user.id });
			await comment.save();
			return res.status(200).json(comment);
		}
	} catch (err) {
		return res.status(500).send("Server Error");
	}
};

const respondToComment = async (req, res) => {
	const commentId = req.params.commentId;
	const { text } = req.body;

	try {
		const user = await User.findById(req.user.id).select("-password");
		const userName = user.name;
		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ msg: "Comment not found" });
		}
		const newResponse = {
			text,
			userName: userName,
			user: user._id,
			comment: commentId,
			date: new Date(),
		};

		comment.responses.unshift(newResponse);

		await comment.save();

		return res.status(200).json(comment.responses);
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
		return res.status(200).json(response);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Server Error");
	}
};

const deleteResponse = async (req, res) => {
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
		if (response.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}
		comment.responses = comment.responses.filter(({ id }) => id !== responseId);

		await comment.save();

		return res.status(200).json(comment.responses);
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
