const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	category: String,
	description: String,
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

ingredientSchema.methods.calculateNutrition = function (portionId, amount) {
	let numericPortionId;
	if (portionId) {
		numericPortionId = Number(portionId);
	}

	let multiplier = amount;
	if (numericPortionId) {
		const selectedPortion = this.foodPortions.find(
			(portion) => portion._id === numericPortionId
		);
		if (!selectedPortion) {
			throw new Error(`Portion with id ${numericPortionId} not found`);
		}
		multiplier = (amount * selectedPortion.gramWeight) / 100;
	}

	const totalNutrition = [];

	try {
		for (const foodNutrient of this.foodNutrients) {
			const calculatedAmount = foodNutrient.value * multiplier;
			totalNutrition.push({
				_id: foodNutrient.nutrient._id,
				name: foodNutrient.nutrient.name,
				amount: calculatedAmount,
				unitName: foodNutrient.nutrient.unit,
				classification: foodNutrient.nutrient.classification,
			});
		}
	} catch (err) {
		throw new Error(`Error calculating: ${err}`);
	}

	return totalNutrition;
};

module.exports = mongoose.model("ingredient", ingredientSchema);
