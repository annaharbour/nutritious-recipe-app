const Recipe = require("../models/RecipeModel");
const User = require("../models/UserModel");
const Rating = require("../models/RatingModel");

const rateRecipe = async (req, res) => {
	const userId = req.user.id || req.user._id;
	const recipeId = req.params.recipeId;
	const { stars } = req.body;

	// Check if the rating is between 1 and 5 stars
	if (stars < 1 || stars > 5) {
		return res
			.status(400)
			.json({ error: "Rating must be between 1 and 5 stars." });
	}

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		const recipe = await Recipe.findById(recipeId);
		if (!recipe) {
			return res.status(404).json({ error: "Recipe not found." });
		}

		// Find existing rating by the user
		let rating = await Rating.findOne({ recipe: recipeId });
		if (rating) {
			// Update existing rating
			const userRating =
				rating && rating.userRatings.find((r) => r.user.toString() === userId);
			if (userRating) {
				userRating.stars = stars;
			} else {
				rating.userRatings.push({ user: userId, stars: stars });
			}
		} else {
			// Create new rating
			rating = new Rating({
				recipe: recipeId,
				userRatings: [{ user: userId, stars: stars }],
			});
		}

		await rating.save();
		return res
			.status(200)
			.json({ userRating: stars, meanRating: rating.meanRating });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const getRating = async (req, res) => {
	const userId = req.user.id || null;
	const recipeId = req.params.recipeId;
	try {
		const recipe = await Recipe.findById(recipeId);
		if (!recipe) {
			return res.status(404).json({ error: "Recipe not found." });
		}

		let rating = await Rating.findOne({ recipe: recipeId });

		if (!rating) {
			return res.status(200).json({ userRating: null, meanRating: null });
		}

		const userRating = rating.userRatings.find(
			(ur) => ur.user.toString() === userId
		);

		return res.status(200).json({
			userRating: userRating ? userRating.stars : null,
			meanRating: rating.meanRating,
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const getUserRatings = async (req, res) => {
	const userId = req.user._id;
	try {
		const ratings = await Rating.find({ "userRatings.user": userId });
		if (!ratings) {
			return res.status(404).json({ userRatings: null });
		}

		const recipeIds = ratings.map((r) => r.recipe);
		const recipes = await Recipe.find(
			{ _id: { $in: recipeIds } },
			{ name: 1, _id: 1 }
		);

		const userRatings = ratings.map((rating) => {
			const recipe = recipes.find(
				(r) => r._id.toString() === rating.recipe.toString()
			);
			const userRating = rating.userRatings.find(
				(ur) => ur.user.toString() === userId
			);
			return {
				recipeId: recipe._id,
				recipeName: recipe.name,
				stars: userRating.stars,
				createdAt: userRating.createdAt,
			};
		});
		return res.status(200).json({ userRatings });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
module.exports = { rateRecipe, getRating, getUserRatings };
