const mongoose = require("mongoose");
const Ingredient = require("./IngredientModel");

const toppingSchema = new mongoose.Schema({
	name: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ingredient",
		required: true,
	},
});

const recipeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	ingredients: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "ingredient",
		}
	],
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	isBowl: {
		type: Boolean,
		default: false,
	},
	toppings: [toppingSchema],
	nutrition: {
		type: mongoose.Schema.Types.Mixed,
		default: {},
	},
});
recipeSchema.methods.calculateNutrition = async function () {
	let totalNutrition = {};

	// Iterate over each ingredient ID in the ingredients array
	for (const ingredientId of this.ingredients) {
		// Find the ingredient by ID
		const ingredient = await Ingredient.findById(ingredientId);
		if (!ingredient) {
			throw new Error(`Ingredient with id ${ingredientId} not found`);
		}

		// Iterate over each nutrient in the ingredient
		for (const nutrient of ingredient.foodNutrients) {
			// Sum up the nutrient amount
			if (!totalNutrition[nutrient.name]) {
				totalNutrition[nutrient.name] = nutrient.amount;
			} else {
				totalNutrition[nutrient.name] += nutrient.amount;
			}
		}
	}

	// Save the total nutrition to the recipe and return it
	this.nutrition = totalNutrition;
	await this.save();

	return totalNutrition;
};

module.exports = mongoose.model("recipe", recipeSchema);
