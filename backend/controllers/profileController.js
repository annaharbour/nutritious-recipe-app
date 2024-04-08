const Profile = require("../models/ProfileModel");
const Recipe = require("../models/RecipeModel");

const getProfile = async (req, res) => {
	const userId = req.params.userId;
	try {
		const profile = await Profile.findOne({ user: userId });

		if (!profile) {
			return res.status(404).json({ message: "Profile not found" });
		}

		const recipes = await Recipe.find({ user: userId }).sort({ createdAt: -1 });

		const profileWithRecipes = {
			_id: profile._id,
			user: profile.user,
			bio: profile.bio,
			createdAt: profile.createdAt,
			recipes: recipes,
		};

		return res.json(profileWithRecipes);
	} catch (err) {
		res.status(500).json({ message: "Server Error" });
	}
};

const createOrUpdateProfile = async (req, res) => {
	const { bio } = req.body;
	const userId = req.user.id;

	const profileFields = {
		user: userId,
		bio,
	};

	try {
		let profile = await Profile.findOneAndUpdate(
			{ user: userId },
			{ $set: profileFields },
			{ new: true, upsert: true }
		);

		res.json(profile);
	} catch (err) {
		res.status(500).json({ message: "Server Error" });
	}
};

module.exports = { getProfile, createOrUpdateProfile };
