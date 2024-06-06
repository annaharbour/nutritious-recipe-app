const mongoose = require("mongoose");
const Nutrient = require("./NutrientModel");

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

ingredientSchema.methods.calculateNutrition = async function (portionId, amount) {
	const totalNutrition = [];

	if (portionId && portionId != 0) {
		let portion = this.foodPortions.find(
			(portion) => portion._id === Number(portionId)
		);
		if (!portion) {
			throw new Error(`Portion with id ${portionId} not found`);
		}
		let multiplier = (amount * portion.gramWeight) / 100;
		try {
			for (const foodNutrient of this.foodNutrients) {
				const calculatedAmount = foodNutrient.value * multiplier;
				const nutrient = await Nutrient.findById(foodNutrient.nutrient._id);
				const {_id, name, unit, classification, macro} = nutrient;
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
	} else {
		try {
			for (const foodNutrient of this.foodNutrients) {
				const calculatedAmount = foodNutrient.value * amount;
				const nutrient = await Nutrient.findById(foodNutrient.nutrient._id);
				const {_id, name, unit, classification, macro} = nutrient;
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
