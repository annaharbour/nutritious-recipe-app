const Ingredient = require("../models/IngredientModel");

const getAllIngredients = async (req, res) => {
	try {
		const ingredients = await Ingredient.find();
		return res.json(ingredients);
	} catch (error) {
		return res.status(500).json({ message: "Server Error" });
	}
};
const getIngredientsByCategory = async (req, res) => {
	const category = req.params.category;
	try {
		const ingredients = await Ingredient.find({ category });
		let descriptionsWithIds = ingredients.map((ingredient) => {
			return {
				id: ingredient._id,
				description: ingredient.description,
			};
		});
		descriptionsWithIds = descriptionsWithIds.sort((a, b) =>
			a.description.localeCompare(b.description)
		);
		return res.json(descriptionsWithIds);
	} catch (err) {
		return res.status(500).json({ message: "Server Error" });
	}
};

const getIngredientNutrition = async (req, res) => {
	try {
		const ingredientId = req.params.id;
		const ingredient = await Ingredient.findById(ingredientId);
		if (!ingredient) {
			return res.status(404).json({ message: "Ingredient not found" });
		}
		const portionId = req.params.portionId;
		const { amount } = req.body;

		try {
			const nutrition = ingredient.calculateNutrition(portionId, amount);
			return res.status(200).json(nutrition);
		} catch (err) {
			return res
				.status(500)
				.json({ message: `Error calculating nutrition: ${err.message} `});
		}
	} catch (err) {
		return res.status(500).json({ message: "Server Error" });
	}
};

const getIngredientById = async (req, res) => {
	const ingredientId = req.params.id;
	try {
		const ingredient = await Ingredient.findById(ingredientId);
		if (!ingredient) {
			return res.status(404).json({ message: "Ingredient not found" });
		}

		return res.json(ingredient);
	} catch (err) {
		return res.status(500).json({ message: "Server Error" });
	}
};

module.exports = {
	getAllIngredients,
	getIngredientsByCategory,
	getIngredientById,
	getIngredientNutrition,
};
