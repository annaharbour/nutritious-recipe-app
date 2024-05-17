const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
	category: String,
	foodClass: String,
	description: String,
	foodNutrients: [
		{
			_id: Number,
			name: String,
			amount: Number,
			unitName: String,
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
    for (const nutrient of this.foodNutrients) {
      const calculatedAmount = nutrient.amount * multiplier;
      totalNutrition.push({
        _id: nutrient._id,
        name: nutrient.name,
        amount: calculatedAmount,
        unitName: nutrient.unitName,
      });
    }
  } catch (err) {
    throw new Error(`Error calculating: ${err}`);
  }

  return totalNutrition;
};


module.exports = mongoose.model("ingredient", ingredientSchema);
