const { check, validationResult } = require("express-validator");
const Recipe = require("../models/RecipeModel");

const createRecipe = async (req, res) => {
	const validateInputs = [
		check("ingredients", "Please include at least one ingredient").isArray({
			min: 1,
		}),
		check("isBowl", "isSmoothieBowl must be a boolean").isBoolean(),
		check("toppings", "Toppings must be an array if it is a smoothie bowl")
			.optional()
			.isArray(),
	];
	validateInputs.forEach((validation) => validation.run(req));

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, ingredients, isBowl, toppings } = req.body;
	const userId = req.user.id;

	const newRecipe = new Recipe({
		name,
		ingredients,
		userId,
		isBowl,
		toppings,
	});

	try {
		const recipe = await newRecipe.save();
		return res.json(recipe);
	} catch (err) {
		return res.status(500).json({ error: "Failed to create the recipe." });
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
		await updatedRecipe.save();
		return res.json(updatedRecipe);
	} catch (err) {
		return res.status(500).json({ error: "Failed to update the recipe." });
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
		return res.status(500).json({ error: "Failed to fetch the recipe." });
	}
};

const deleteRecipeById = async (req, res) => {
	const recipeId = req.params.id;

	try {
		const recipe = await Recipe.findByIdAndRemove(recipeId);
		if (!recipe) {
			return res.status(404).json({ error: "Recipe not found." });
		}
		return res.json({ message: "Recipe removed" });
	} catch (err) {
		return res.status(500).json({ error: "Failed to delete the recipe." });
	}
};

module.exports = {
	createRecipe,
	getRecipes,
	getRecipeById,
	updateRecipeById,
	deleteRecipeById,
};
