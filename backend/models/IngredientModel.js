const mongoose = require("mongoose");
const Nutrient = require("./NutrientModel");
require("dotenv").config();

const ingredientSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	category: String,
	description: String,
	imageUrl: String,
	foodNutrients: [
		{
			nutrient: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "nutrient",
				required: true,
			},
			value: {
				type: Number,
				default: 0,
				required: true,
			},
		},
	],
	foodPortions: [
		{
			_id: Number,
			sequenceNumber: Number,
			modifier: String,
			amount: String,
			gramWeight: Number,
		},
	],
});

ingredientSchema.methods.calculateNutrition = async function (
	portionId,
	amount
) {
	const totalNutrition = [];

	if (portionId && portionId != 0) {
		let portion = this.foodPortions.find(
			(portion) => portion._id === Number(portionId)
		);
		if (!portion) {
			throw new Error(`Portion with id ${portionId} not found`);
		}
		// Multiplier helps us find the nutrition for the amount and portion of the ingredient. Default nutrition is for 100g.
		let multiplier = (amount * portion.gramWeight) / 100;
		try {
			// Loop through the foodNutrients array and calculate the nutrition for the ingredient
			for (const foodNutrient of this.foodNutrients) {
				// Calculate the amount for each nutrient
				const calculatedAmount = foodNutrient.value * multiplier;
				// Find the nutrient by id
				const nutrient = await Nutrient.findById(foodNutrient.nutrient._id);
				// Destructure the nutrient object
				const { _id, name, unit, classification, macro } = nutrient;
				// If the nutrient is marked with a classification, add the nutrient to the totalNutrition array
				classification &&
					totalNutrition.push({
						_id: _id,
						amount: calculatedAmount,
						unit: unit,
						name: name,
						classification: classification,
						// marking the macro nutrients
						isMacroNutrient: macro ? true : false,
					});
			}
		} catch (err) {
			throw new Error(`Error calculating: ${err}`);
		}
		// If portionId is 0, calculate the nutrition for 100g of the ingredient
	} else {
		try {
			for (const foodNutrient of this.foodNutrients) {
				const calculatedAmount = foodNutrient.value * amount;
				const nutrient = await Nutrient.findById(foodNutrient.nutrient._id);
				const { _id, name, unit, classification, macro } = nutrient;
				classification &&
					totalNutrition.push({
						_id: _id,
						amount: calculatedAmount,
						unit: unit,
						name: name,
						classification: classification,
						isMacroNutrient: macro ? true : false,
					});
			}
		} catch (err) {
			throw new Error(`Error calculating: ${err}`);
		}
	}

	return totalNutrition;
};

module.exports = mongoose.model("ingredient", ingredientSchema);
