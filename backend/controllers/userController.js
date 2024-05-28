const User = require("../models/UserModel");
const Comment = require("../models/CommentModel");
const Recipe = require("../models/RecipeModel");

const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		if (users) {
			return res.json(users);
		} else {
			return res.status(404).json({ error: "No users found." });
		}
	} catch (err) {
		return res.status(500).json({ error: "Failed to fetch users." });
	}
};

const getUserById = async (req, res) => {
	const userId = req.params.id;
	try {
		const user = await
		User.findById(userId).select('-password -email -phone -__v -createdAt');
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}
		return res.json(user);
	}
	catch (err) {
		return res.status(500).json({ msg: "Server Error", error: err.message });
	}
};

const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}
		return res.json(user);
	} catch (err) {
		return res.status(500).send("Server Error");
	}
};

const deleteUser = async (req, res) => {
	const userId = req.params.id;
	try {
		await Comment.deleteMany({ user: userId });
		await Recipe.deleteMany({ user: userId });
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		} else {
			await User.findByIdAndUpdate(userId, { profile: null });

			return res.json({ msg: "User deleted" });
		}
	} catch (err) {
		return res.status(500).json({ msg: "Server Error", error: err.message });
	}
};

module.exports = { getUsers, getUserById, deleteUser };
