const bcrypt = require("bcryptjs");
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
		const user = await User.findById(userId).select(
			"-password -email -phone -__v -createdAt"
		);
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}
		return res.json(user);
	} catch (err) {
		return res.status(500).json({ msg: "Server Error", error: err.message });
	}
};

const getUser = async (req, res) => {
	const userId = req.user.id;
	try {
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}
		return res.json(user);
	} catch (err) {
		return res.status(500).json({ msg: "Server Error", error: err.message });
	}
};

const getUserFavorites = async (req, res) => {
	const userId = req.params.userId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}
		return user.favoriteRecipes ? user.favoriteRecipes : []
		// return user.favoriteRecipes && user.favoriteRecipes.length > 0 ? res.status(200).json(user.favoriteRecipes) : res.status(200).json([]);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const updateUser = async (req, res) => {
	const userId = req.user.id;
	const { name, email, phone, password, newPassword } = req.body;
  
	try {
	  // Check if all required fields are filled
	  if (!name || !email || !phone) {
		return res.status(400).json({ message: "Please fill in all fields." });
	  }
  
	  // Check if the email is already in use by another user
	  let user = await User.findOne({ email });
	  if (user && user._id.toString() !== userId.toString()) {
		return res.status(400).json({ message: "Email already in use. Please use a different email to register." });
	  }
  
	  // Find the user by ID
	  user = await User.findById(userId);
	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  // Validate the current password
	  const isMatch = await bcrypt.compare(password, user.password);
	  if (!isMatch) {
		return res.status(400).json({ message: "Please validate the password associated with your account." });
	  }
  
	  // Update user information
	  user.name = name;
	  user.email = email;
	  user.phone = phone;
  
	  // Update password if a new one is provided
	  if (newPassword) {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(newPassword, salt);
	  }
  
	  // Save the updated user
	  await user.save();
  
	  // Return the updated user information
	  return res.status(200).json(user);
	} catch (err) {
	  return res.status(500).json({ message: "Server Error", error: err.message });
	}
  };
  

const deleteUser = async (req, res) => {
	const userId = req.params.id;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		await Promise.all([
			Comment.deleteMany({ user: userId }),
			Recipe.deleteMany({ userId: userId }),
		]);

		await Comment.updateMany(
			{ "likes.userId": userId },
			{ $pull: { likes: { user: userId } } }
		);

		await Comment.updateMany(
			{ "responses.user": userId },
			{ $pull: { responses: { user: userId } } }
		);

		await user.deleteOne();
		return res.status(200).json({ msg: "User deleted" });
	} catch (err) {
		return res.status(500).json({ msg: "Server Error", error: err.message });
	}
};

module.exports = {
	getUsers,
	getUserFavorites,
	getUser,
	updateUser,
	getUserById,
	deleteUser,
};
