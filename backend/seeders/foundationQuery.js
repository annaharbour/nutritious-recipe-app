require("dotenv").config();
const db = process.env.mongoURI;
const Ingredient = require("../models/IngredientModel");
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const FDC_API_KEY = process.env.FDC_API_KEY;

const fdcids = [

];

const getFoodData = async (ids) => {
	try {
		const responses = await Promise.all(
			ids.map(async (fdcId) => {
				const res = await axios.get(
					`https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${FDC_API_KEY}`
				);
				return res.data;
			})
		);
		return responses;
	} catch (error) {
		console.error("Error fetching data:", error);
	}
}; 

const formatFoodData = (foods) => {
	return foods.map((food) => ({
		_id: food.id,
		category:
			food.brandedFoodCategory,
		description:
			food.description.charAt(0).toUpperCase() +
			food.description.slice(1).toLowerCase(),

		foodNutrients: food.foodNutrients.map((nutrient) => ({
			_id: nutrient.id,
			name: nutrient.nutrient.name,
			amount: nutrient.amount,
			unitName: nutrient.nutrient.unitName,
		})),

		foodPortions: [
			{
				amount:
					food.householdServingFullText &&
					food.householdServingFullText.split(" ", 2)[0],
				modifier:
					food.householdServingFullText &&
					(food.householdServingFullText.split(" ", 2)[1].toLowerCase() ===
						"onz" || "oza"
						? "oz"
						: food.householdServingFullText
								.split(" ", 2)[1]
								.toLowerCase()
								.includes("tea")
						? "tsp"
						: food.householdServingFullText
								.split(" ", 2)[1]
								.toLowerCase()
								.includes("table")
						? "tbsp"
						: food.householdServingFullText.split(" ", 3).length > 2
						? `${food.householdServingFullText
								.split(" ", 2)[1]
								.toLowerCase()} ${food.householdServingFullText
								.split(" ", 3)[2]
								.toLowerCase()}`
						: food.householdServingFullText.split(" ", 2)[1].toLowerCase()),
				gramWeight: food.servingSize,
				sequenceNumber: 1,
			},
		],
	}));
};

const fetchAndFormatData = async () => {
	const foodData = await getFoodData(fdcids);
	const formattedData = formatFoodData(foodData);

	try {
		async function seedIngredients() {
			try {
				await mongoose.connect(db, {
					useNewUrlParser: true,
				});

				await Ingredient.insertMany(formattedData);
				console.log("Ingredients created.");
				console.log("Seeding complete.");
				process.exit();
			} catch (err) {
				console.error("Error seeding database:", err.message);
				process.exit(1);
			}
		}

		seedIngredients();
	} catch (error) {
		console.error("Error parsing JSON:", error);
	}
};

fetchAndFormatData();
