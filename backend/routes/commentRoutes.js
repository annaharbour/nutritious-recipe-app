const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
	getCommentsByRecipeId,
	createComment,
	deleteCommentById,
	toggleLikeComment,
	respondToComment,
	getResponse,
	deleteResponse,
	getCommentById,
} = require("../controllers/commentController");

// @route POST api/comments
//@desc Create a comment
// @access Private
router.route("/:recipeId").get(getCommentsByRecipeId).post(auth, createComment);

// @route    GET api/comments/:id
// @desc     Get post by ID
// @access   Public
// @route    DELETE api/comments/:id
// @desc     Delete a post
// @access   Private
router
	.route("/comment/:commentId")
	.get(getCommentById)
	.put(auth, toggleLikeComment)
	.post(auth, respondToComment)
	.delete(auth, deleteCommentById);

// @route    DELETE api/comments/:id/:responseId
// @desc	 Delete a response
// @access   Private
router.route("/response/:responseId").get(auth, getResponse).delete(auth, deleteResponse);


module.exports = router;
