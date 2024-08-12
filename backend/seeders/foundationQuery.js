require("dotenv").config();
const db = process.env.MONGO_URI;
const Ingredient = require("../models/IngredientModel");
const Nutrient = require("../models/NutrientModel");
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const FDC_API_KEY = process.env.FDC_API_KEY;

const fdcids = [
	2343062, 2343010, 2343013 , 2343014 
];

const getFoodData = async (ids) => {
	try {
		const responses = await Promise.all(
			ids.map(async (id) => {
				const res = await axios.get(
					`https://api.nal.usda.gov/fdc/v1/food/${id}?api_key=${FDC_API_KEY}`
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
		_id: new mongoose.Types.ObjectId(),
		category: "Nut and Seed Products",
		description:
			food.description.charAt(0).toUpperCase() +
			food.description.slice(1).toLowerCase(),
		foodNutrients: food.foodNutrients.map((nutrient) => ({
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
								.includes("teaspoon")
						? "tsp"
						: food.householdServingFullText
								.split(" ", 2)[1]
								.toLowerCase()
								.includes("tablespoon")
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
					useUnifiedTopology: true,
				});

				const nutrientMap = new Map();

				// Step 1: Insert nutrients if they don't exist and build a nutrient map
				for (const ingredient of formattedData) {
					for (const nutrient of ingredient.foodNutrients) {
						if (!nutrientMap.has(nutrient.name)) {
							let nutrientDoc = await Nutrient.findOne({ name: nutrient.name });
							if (!nutrientDoc) {
								nutrientDoc = new Nutrient({
									_id: new mongoose.Types.ObjectId(),
									name: nutrient.name,
									unit: nutrient.unitName,
								});
								await nutrientDoc.save();
							}
							nutrientMap.set(nutrient.name, nutrientDoc._id);
						}
					}
				}

				// Step 2: Insert ingredients with references to nutrient IDs
				for (const ingredient of formattedData) {
					const foodNutrients = ingredient.foodNutrients.map((nutrient) => ({
						nutrient: nutrientMap.get(nutrient.name),
						value: nutrient.amount,
					}));

					const ingredientDoc = new Ingredient({
						_id: ingredient._id,
						category: ingredient.category,
						foodClass: ingredient.foodClass,
						description: ingredient.description,
						foodNutrients,
						foodPortions: ingredient.foodPortions,
					});

					await ingredientDoc.save();
				}

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
