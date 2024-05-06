require("dotenv").config();
const db = process.env.mongoURI;
const Ingredient = require("../models/IngredientModel");
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const FDC_API_KEY = process.env.FDC_API_KEY;

const fdcids = [
	// 2653564, 2608970, 2587229, 2640766, 2554167, 2398185, 1064113, 2640546,
	// 2381977, 2472591, 2584614, 2164544, 2671792, 2423680, 1064107, 2398182,
	// 2465280, 2432436, 1933229, 2598563, 2373541, 1913005, 2665462, 2636682,
	// 2426737, 2031939, 1887959, 1934107, 2093420, 2386659, 2449999, 2098095,
	// 2280065, 2423680, 1918588, 2136463, 2280458, 2522630, 2544581, 2014635,
	// 2670249, 2674943, 1911332, 1891132, 2664579, 2621829, 2482434, 2675467,
	// 2658112, 2617999, 2658111, 2618000, 2618003, 2287768, 2461225, 1897132,
	// 2039125, 2652620, 2573420, 2652386, 2652386, 516491, 2438454, 2438455,
	// 1922276, 2677675, 2670631, 2673121, 2541747, 2640901, 2640901, 2271278,
	// 2677674, 2242280, 2461766, 520303, 2432016, 2242285, 2074691, 1957994,
	// 2663401, 2663400, 2210672, 2479182, 2172058, 1904666, 1889484, 1909704,
	// 2058028, 2471274, 2573424, 2482731, 1989728, 2408469, 2408468, 2544126,
	// 2656984, 2468596,
	2212558 , 1972667 , 2678738 , 2175640 
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
			food.brandedFoodCategory.toLowerCase() === "plant based milk"
				? "Liquid"
				: food.brandedFoodCategory.toLowerCase() === "cheese" ||
				  food.brandedFoodCategory.toLowerCase() ===
						"specialty formula supplements" ||
				  food.brandedFoodCategory.toLowerCase().includes("yogurt") ||
				  food.brandedFoodCategory.toLowerCase().includes("protein") ||
				  food.description.toLowerCase().includes("protein")
				? "Protein"
				: food.description.toLowerCase().includes("cacao") ||
				  food.description.toLowerCase().includes("acai") ||
				  food.brandedFoodCategory.toLowerCase() === "herbal supplements" ||
				  food.brandedFoodCategory.toLowerCase().includes("green") ||
				  food.brandedFoodCategory.toLowerCase() ===
						"antioxidant supplements" ||
				  food.description.toLowerCase().includes("camu")
				? "Flavor"
				: food.brandedFoodCategory.toLowerCase() === "cereal" ||
				  food.brandedFoodCategory.toLowerCase().includes("grain")
				? "Grains"
				: food.description.toLowerCase().includes("chips") ||
				  food.description.toLowerCase().includes("nibs") ||
				  food.brandedFoodCategory.toLowerCase() === "wholesome snacks"
				? "Toppings"
				: food.brandedFoodCategory,
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

	// formattedData.forEach((food) => console.log(food));

	try {
		async function seedIngredients() {
			try {
				// Connect to the database
				await mongoose.connect(db, {
					useNewUrlParser: true,
				});

				// Loop through the ingredientsData array and create new ingredient documents
				await Ingredient.insertMany(formattedData);
				console.log("Ingredients created.");
				console.log("Seeding complete.");
				process.exit(); // Exit the process
			} catch (err) {
				console.error("Error seeding database:", err.message);
				process.exit(1); // Exit the process with an error code
			}
		}

		// Run the seedIngredients function to start the seeding process
		seedIngredients();
	} catch (error) {
		console.error("Error parsing JSON:", error);
	}
};

fetchAndFormatData();
