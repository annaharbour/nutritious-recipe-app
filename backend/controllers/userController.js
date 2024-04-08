const User = require("../models/UserModel");
const Comment = require("../models/CommentModel");
const Recipe = require("../models/RecipeModel");
const Profile = require("../models/ProfileModel");

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

const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		res.json(user);
	} catch (err) {
		res.status(500).send("Server Error");
	}
};

const deleteUser = async (req, res) => {
	const userId = req.params.id;
	try {
		await Comment.deleteMany({ user: userId });
		await Recipe.deleteMany({ user: userId });
		await Profile.findOneAndRemove({ user: userId });
		await User.findOneAndRemove({ _id: userId });

		const user = await User.findById(userId);
		if (!user) {
			return res.json({ msg: "User and associated data deleted" });
		} else {
			return res.status(404).json({ msg: "Failure to delete user" });
		}
	} catch (err) {
		res.status(500).send("Server Error");
	}
};

module.exports = { getUsers, getUser, deleteUser };
