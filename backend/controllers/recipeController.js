const Recipe = require("../models/RecipeModel");
const User = require("../models/UserModel");

const createRecipe = async (req, res) => {
	const { name, ingredients, isBowl, toppings } = req.body;

	const userId = req.user.id;

	const recipe = new Recipe({
		name,
		ingredients,
		userId,
		isBowl,
		toppings,
	});

	try {
		await recipe.calculateNutrition();
		await recipe.save();
		return res.status(200).json(recipe);
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

const getRecipes = async (req, res) => {
	try {
		const recipes = await Recipe.find();
		return res.json(recipes);
	} catch (err) {
		return res.status(500).json({ error: "Failed to fetch recipes." });
	}
};

const updateRecipeById = async (req, res) => {
	const recipeId = req.params.id;
	const { name, ingredients, isBowl, toppings } = req.body;

	try {
		const updatedRecipe = await Recipe.findByIdAndUpdate(
			recipeId,
			{ name, ingredients, isBowl, toppings },
			{ new: true }
		);
		await updatedRecipe.calculateNutrition();
		await updatedRecipe.save();
		return res.status(200).json(updatedRecipe);
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

const getRecipeById = async (req, res) => {
	const recipeId = req.params.id;

	try {
		const recipe = await Recipe.findById(recipeId);
		if (!recipe) {
			return res.status(404).json({ error: "Recipe not found." });
		}
		return res.json(recipe);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const deleteRecipeById = async (req, res) => {
	const recipeId = req.params.id;

	try {
		const recipe = await Recipe.findByIdAndRemove(recipeId);
		if (!recipe) {
			return res.status(404).json({ error: "Recipe not found." });
		}
		return res.status(200).json({ message: "Recipe removed" });
	} catch (err) {
		return res.status(500).json({ error: "Failed to delete the recipe." });
	}
};

const getRecipesByUserId = async (req, res) => {
	const userId = req.params.userId;
	try {
		const recipes = await Recipe.find({ userId: userId });
		return recipes
			? res.status(200).json(recipes)
			: res.status(404).json({ error: "No recipes found." });
	} catch (err) {
		return res.status(500).json({ error: "Failed to fetch recipes." });
	} 
};

module.exports = {
	createRecipe,
	getRecipes,
	getRecipeById,
	updateRecipeById,
	deleteRecipeById,
	getRecipesByUserId
};
