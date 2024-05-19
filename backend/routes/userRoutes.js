const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
	getUsers,
	getUser,
	deleteUser,
} = require("../controllers/userController");

//Get /users
//@desc Get all users
//@access Private
router.route("/").get(auth, getUsers);

// Get /users/:id
// @desc Get or delete user by id
// @access Private
router.route("/:id").get(auth, getUser).delete(auth, deleteUser);



module.exports = router;
