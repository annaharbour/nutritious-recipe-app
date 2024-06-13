const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
	getUsers,
	getUserById,
	deleteUser,
	getUserFavorites,
} = require("../controllers/userController");

//Get /users
//@desc Get all users
//@access Private
router.route("/").get(auth, getUsers);

// Get /users/favorites
// @desc Get user favorite recipes
router.get("/favorites", auth, getUserFavorites);

// Get /users/:id
// @desc Get or delete user by id
// @access Private
router.route("/:id").get(getUserById).delete(auth, deleteUser);

module.exports = router;
