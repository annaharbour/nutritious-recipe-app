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

recipeSchema.methods.calculateNutrition = async function () {
	const totalNutrition = [];
  
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
  
	totalNutrition.sort((a, b) => {
	  const classificationA = a.classification.toLowerCase();
	  const classificationB = b.classification.toLowerCase();
	  if (classificationA < classificationB) {
		return -1;
	  }
	  if (classificationA > classificationB) {
		return 1;
	  }
  
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
  
	this.nutrition = totalNutrition;
	return totalNutrition;
  };
  
  recipeSchema.pre("save", async function (next) {
	await this.calculateNutrition();
	next();
  });

module.exports = mongoose.model("recipe", recipeSchema);
