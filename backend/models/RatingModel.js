const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
	meanRating: {
		type: Number,
		required: true,
	},
	ratings: {
		oneStar: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
		],
		twoStars: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
		],
		threeStars: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
		],
		fourStars: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
		],
		fiveStars: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
		],
    },
});

ratingSchema.pre("save", async function (next) {
    const rating = this;

    if (rating.isModified("ratings")) {
        rating.meanRating = rating.calculateMeanRating();
    }

    next();
});

ratingSchema.methods.calculateMeanRating = function () {
    const rating = this;

    const totalRatings = rating.ratings.oneStar.length +
        rating.ratings.twoStars.length +
        rating.ratings.threeStars.length +
        rating.ratings.fourStars.length +
        rating.ratings.fiveStars.length;

    const totalPoints = rating.ratings.oneStar.length +
        rating.ratings.twoStars.length * 2 +
        rating.ratings.threeStars.length * 3 +
        rating.ratings.fourStars.length * 4 +
        rating.ratings.fiveStars.length * 5;

    return Math.round(totalPoints / totalRatings);
};

module.exports = mongoose.model("rating", ratingSchema);
