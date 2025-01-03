const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
	},
	phone: {
		type: String,
	},
	password: {
		type: String,
	},
	oAuthProvider: {
		type: String,
	},
	oAuthId: {
		type: String,
	},
	profile: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "profile",
	},
	recipes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "recipe",
		},
	],
	favoriteRecipes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "recipe",
		},
	],
	resetPasswordToken: {
		type: String,
	},
	resetPasswordExpires: {
		type: Date,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("user", UserSchema);
