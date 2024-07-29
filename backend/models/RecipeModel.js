const mongoose = require("mongoose");
const Ingredient = require("./IngredientModel");

const recipeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
	servings: { type: Number, default: 1 },
	ingredients: [
		{
			_id: { type: mongoose.Schema.Types.ObjectId, ref: "ingredient" },
			amount: Number,
			portionId: Number,
			category: String,
			description: String,
			modifier: String,
			gramWeight: Number,
			imageUrl: String,
		},
	],
	nutrition: [
		{
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},
	],
	labels: [
		{
			type: String,
			enum: [
				"Lean",
				"Low Carb",
				"High Protein",
				"Low Fat",
				"Bulking",
				"Balanced",
			],
		},
	],
	createDate: { type: Date, default: Date.now },
});

recipeSchema.methods.calculateNutrition = async function () {
	const totalNutrition = [];
	this.labels = [];
	const servings = this.servings || 1;
	let totalCalories = 0;
	let totalCarbohydrates = 0;
	let totalProtein = 0;
	let totalFat = 0;

	for (const ingredient of this.ingredients) {
		const { _id, amount, portionId } = ingredient;
		const foundIngredient = await Ingredient.findById(_id).populate(
			"foodNutrients.nutrient"
		);
		if (!foundIngredient) {
			throw new Error(`Ingredient with id ${_id} not found`);
		}

		const ingredientNutrition = await foundIngredient.calculateNutrition(
			portionId,
			amount
		);

		for (const nutrient of ingredientNutrition) {
			nutrient.amount /= servings;
			totalNutrition.push(nutrient);

			if (nutrient.macro && nutrient.macro === true) {
				if (nutrient.name === "Energy") {
					totalCalories += nutrient.amount;
				} else if (nutrient.name === "Carbohydrates") {
					totalCarbohydrates += nutrient.amount;
				} else if (nutrient.name === "Protein") {
					totalProtein += nutrient.amount;
				} else if (nutrient.name === "Fat") {
					totalFat += nutrient.amount;
				}
			}
		}
	}

	if (totalCalories < 300) {
		this.labels.push("Lean");
	}
	if ((totalCarbohydrates * 4) / totalCalories < 0.1) {
		this.labels.push("Low Carb");
	}
	if ((totalProtein * 4) / totalCalories > 0.4) {
		this.labels.push("High Protein");
	}
	if (totalFat < 20) {
		this.labels.push("Low Fat");
	}
	if (totalCalories > 400) {
		this.labels.push("Bulking");
	}

	this.nutrition = totalNutrition;
	return totalNutrition;
};

module.exports = mongoose.model("recipe", recipeSchema);
