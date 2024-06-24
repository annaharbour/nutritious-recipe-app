const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
	getUser,
	getUsers,
	getUserById,
	deleteUser,
	getUserFavorites,
	updateUser,
} = require("../controllers/userController");

//Get /users
//@desc Get all users
//@access Private
router.route("/").get(auth, getUsers);

// Get /users
// @desc Get user by id
// @access Private
router.get("/user", auth, getUser).put(auth, updateUser);

// Get /users/favorites
// @desc Get user favorite recipes
router.get("/favorites", auth, getUserFavorites);

// Get /users/:id
// @desc Get or delete user by id
// @access Private
router.route("/:id").get(getUserById).delete(auth, deleteUser).put(auth, updateUser);

module.exports = router;
