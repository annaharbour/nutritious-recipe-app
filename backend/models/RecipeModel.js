const mongoose = require("mongoose");
const Ingredient = require("./IngredientModel");

const recipeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	rating: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "rating",
	},
	ingredients: [
		{
			_id: { type: mongoose.Schema.Types.ObjectId, ref: "ingredient" },
			amount: Number,
			portionId: Number,
			category: String,
			description: String,
			modifier: String,
			gramWeight: Number,
		},
	],
	nutrition: [
		{
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},
	],
});

// Calculate the nutrition of the recipe
recipeSchema.methods.calculateNutrition = async function () {
	// Initialize the totalNutrition array
	const totalNutrition = [];

	// Loop through the ingredients in the recipe
	for (const ingredient of this.ingredients) {
		// Destructure the ingredient object
		const { _id, amount, portionId } = ingredient;

		// Find the ingredient by id and populate the foodNutrients
		const foundIngredient = await Ingredient.findById(_id).populate(
			"foodNutrients.nutrient"
		);
		if (!foundIngredient) {
			throw new Error(`Ingredient with id ${_id} not found`);
		}

		// Calculate the nutrition of the ingredient
		const ingredientNutrition = await foundIngredient.calculateNutrition(
			portionId,
			amount
		);

		// Add the nutrition of the ingredient to the totalNutrition array
		ingredientNutrition.forEach((nutrient) => {
			const existingNutrient = totalNutrition.find((n) =>
				n._id.equals(nutrient._id)
			);
			if (existingNutrient) {
				existingNutrient.amount += nutrient.amount;
			} else {
				totalNutrition.push(nutrient);
			}
		});
	}

	// Sorting the nutrients
	totalNutrition.sort((a, b) => {
		// Sorting by classification
		const classificationA = a.classification.toLowerCase();
		const classificationB = b.classification.toLowerCase();
		if (classificationA < classificationB) {
			return -1;
		}
		if (classificationA > classificationB) {
			return 1;
		}

		// Sorting by name
		const nameA = a.name.toLowerCase();
		const nameB = b.name.toLowerCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}

		return 0;
	});

	// Setting nutrition of the recipe
	this.nutrition = totalNutrition;
	return totalNutrition;
};

// Every time a recipe is saved, calculateNutrition will be called
recipeSchema.pre("save", async function (next) {
	await this.calculateNutrition();
	next();
});

module.exports = mongoose.model("recipe", recipeSchema);
