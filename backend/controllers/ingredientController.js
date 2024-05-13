const Ingredient = require("../models/IngredientModel"); // Import your Mongoose Ingredient model

const getAllIngredients = async (req, res) => {
	try {
		const ingredients = await Ingredient.find();
		res.json(ingredients);
	} catch (error) {
		res.status(500).json({ message: "Server Error" });
	}
};
const getIngredientsByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const ingredients = await Ingredient.find({ category });
        let descriptionsWithIds = ingredients.map((ingredient) => {
            return {
                id: ingredient._id,
                description: ingredient.description
            };
        });
        descriptionsWithIds = descriptionsWithIds.sort((a, b) => a.description.localeCompare(b.description));
        res.json(descriptionsWithIds);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};


const getIngredientById = async (req, res) => {
	const ingredientId = req.params.id;
	try {
		const ingredient = await Ingredient.findById(ingredientId);
		if (!ingredient) {
			return res.status(404).json({ message: "Ingredient not found" });
		}
		res.json(ingredient);
	} catch (err) {
		res.status(500).json({ message: "Server Error" });
	}
};

module.exports = {
	getAllIngredients,
	getIngredientsByCategory,
	getIngredientById,
};
