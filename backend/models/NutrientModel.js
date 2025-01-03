const mongoose = require("mongoose");

const nutrientSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	unit: {
		type: String,
		required: true,
	},
	classification: {
		type: String,
	},
	macro: {
		type: Boolean	}
});

const Nutrient = mongoose.model("nutrient", nutrientSchema);

module.exports = Nutrient;
