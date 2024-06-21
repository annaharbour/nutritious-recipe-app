const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
	recipe: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Recipe",
		required: true,
	},
	meanRating: {
		type: Number,
		default: null,
	},
	userRatings: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
			stars: {
				type: Number,
				required: true,
				min: 1,
				max: 5,
			},
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

ratingSchema.pre("save", async function (next) {
	const totalRatings = this.userRatings.length;
	const totalPoints = this.userRatings.reduce(
		(acc, rating) => acc + rating.stars,
		0
	);
	this.meanRating = totalPoints / totalRatings;
	next();
});

module.exports = mongoose.model("Rating", ratingSchema);
