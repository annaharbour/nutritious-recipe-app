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

		ingredientNutrition.forEach((nutrient) => {
			const existingNutrient = totalNutrition.find((n) =>
				n._id.equals(nutrient._id)
			);
			if (existingNutrient) {
				existingNutrient.amount += nutrient.amount;
			} else {
				totalNutrition.push(nutrient);
			}

			// Sum up macros
			if (nutrient.macro && nutrient.macro === true) {
				if (nutrient.name === "Energy") {
					totalCalories += nutrient.amount;
				}
				if (nutrient.name === "Carbohydrates") {
					totalCarbohydrates += nutrient.amount;
				} else if (nutrient.name === "Protein") {
					totalProtein += nutrient.amount;
				} else if (nutrient.name === "Fat") {
					totalFat += nutrient.amount;
				}
			}
		});
	}

	totalNutrition.sort((a, b) => {
		// Sort by classification
		const classificationA = a.classification.toLowerCase();
		const classificationB = b.classification.toLowerCase();
		if (classificationA < classificationB) {
			return -1;
		}
		if (classificationA > classificationB) {
			return 1;
		}
		// Sort by name
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

	// Determine macro ratios
	const carbRatio = totalCalories ? (totalCarbohydrates * 4) / totalCalories : 0;
	const proteinRatio = totalCalories ? (totalProtein * 4) / totalCalories : 0;
	const fatRatio = totalCalories ? (totalFat * 9) / totalCalories : 0;

	this.labels = [];

	if (proteinRatio > 0.3 && carbRatio < 0.4 && fatRatio < 0.3) {
		this.labels.push("Lean");
	}
	if (carbRatio < 0.25) {
		this.labels.push("Low Carb");
	}
	if (proteinRatio > 0.4) {
		this.labels.push("High Protein");
	}
	if (fatRatio < 0.2) {
		this.labels.push("Low Fat");
	}
	if (totalCalories > 400) {
		this.labels.push("Bulking");
	}
	if (this.labels.length === 0) {
		this.labels.push("Balanced");
	}

	// Calculate nutrition per serving
	const servings = this.servings || 1;
	this.nutrition.forEach((nutrient) => {
		nutrient.amount /= servings;
	});

	return totalNutrition;
};


module.exports = mongoose.model("recipe", recipeSchema);
