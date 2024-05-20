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
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	rating: {
		type: mongoose.Schema.Types.ObjectId,
	 	ref: "rating"
	},
	ingredients: [
		{
			_id: { type: mongoose.Schema.Types.ObjectId, ref: "ingredient" },
			amount: Number,
			portionId: Number,
		},
	],
	isBowl: {
		type: Boolean,
		default: false,
	},
	toppings: [toppingSchema],
	nutrition: [{
		type: mongoose.Schema.Types.Mixed,
		default: {},}
	]
});

recipeSchema.methods.calculateNutrition = async function () {
	const totalNutrition = {};

	for (const ingredient of this.ingredients) {
		const { _id, amount, portionId } = ingredient;

		const foundIngredient = await Ingredient.findById(_id);
		if (!foundIngredient) {
			throw new Error(
				`Ingredient with id ${ingredient.ingredientId} not found`
			);
		}

		const ingredientNutrition = foundIngredient.calculateNutrition(
			portionId,
			amount
		);

		for (const nutrient of ingredientNutrition) {
			if (!totalNutrition[nutrient.name]) {
				totalNutrition[nutrient.name] = {
					_id: nutrient._id,
					name: nutrient.name,
					amount: nutrient.amount,
					unitName: nutrient.unitName,
				};
			} else {
				totalNutrition[nutrient.name].amount += nutrient.amount;
			}
		}
	}

	const totalNutritionArray = Object.values(totalNutrition);

	this.nutrition = totalNutritionArray;
	await this.save();

	return totalNutritionArray;
};


module.exports = mongoose.model("recipe", recipeSchema);
