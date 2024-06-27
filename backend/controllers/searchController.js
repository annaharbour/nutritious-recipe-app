const Recipe = require("../models/RecipeModel");
const User = require("../models/UserModel");
const Ingredient = require("../models/IngredientModel");
const Rating = require("../models/RatingModel");

// search by rating, search by nutrient values, search by user name, search by recipe name, search by nutrients

const searchByRecipeName = async (req, res) => {
	const { recipeName } = req.body;
	try {
		const recipes = await Recipe.find({
			name: { $regex: recipeName, $options: "i" },
		}).sort({ name: 1 });

		if (recipes.length === 0) {
			return res.status(404).json({ error: "No recipes found" });
		}

		res.json(recipes);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const searchRecipesByUserName = async (req, res) => {
	const { userName } = req.body;
	try {
		// Find users whose names match the given userName
		const users = await User.find({
			name: { $regex: userName, $options: "i" },
		});
		if (users.length === 0) {
			return res.status(404).json({ error: "No users found" });
		}

		// Extract user IDs
		const userIds = users.map((user) => user._id);

		// Find recipes associated with the extracted user IDs
		const recipes = await Recipe.find({
			userId: { $in: userIds },
		}).sort({ userName: 1 });

		if (recipes.length === 0) {
			return res.status(404).json({ error: "No recipes found" });
		}

		res.json(recipes);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const searchByNutrients = async (req, res) => {
	const { nutrients, sortCriteria } = req.body; // Expecting sortCriteria to be an array of objects [{ nutrientId, order }]
	try {
		// Build the query to match recipes containing the specified nutrients with the required amounts
		const matchConditions = nutrients.map((nutrient) => {
			const comparisonOperator = nutrient.lessThan ? "$lte" : "$gte";
			return {
				nutrition: {
					$elemMatch: {
						_id: nutrient._id,
						amount: { [comparisonOperator]: nutrient.amount },
					},
				},
			};
		});

		// Use $and operator to combine multiple nutrient conditions
		const recipes = await Recipe.find({ $and: matchConditions });

		// Check if no recipes were found
		if (recipes.length === 0) {
			return res.status(404).json({ error: "No recipes found" });
		}

		// Sort the recipes based on the provided sort criteria
		recipes.sort((a, b) => {
			for (let criterion of sortCriteria) {
				const { nutrientId, order } = criterion;
				const nutrientA = a.nutrition.find((n) => n._id.equals(nutrientId));
				const nutrientB = b.nutrition.find((n) => n._id.equals(nutrientId));

				if (nutrientA && nutrientB) {
					if (nutrientA.amount < nutrientB.amount) {
						return order === "asc" ? -1 : 1;
					} else if (nutrientA.amount > nutrientB.amount) {
						return order === "asc" ? 1 : -1;
					}
				}
			}
			return 0; // If all criteria are equal, maintain original order
		});

		res.json(recipes);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const searchRecipesByIngredients = async (req, res) => {
	const { includeIngredientIds, excludeIngredientIds } = req.body;
	// Expects
	// {
	//     "includeIngredientIds": ["663298a5492272226d58b77d", "someOtherIngredientId"],
	//     "excludeIngredientIds": ["someExcludedIngredientId"]
	// }

	try {
		// Validate that at least one include or exclude list is provided
		if (!includeIngredientIds?.length && !excludeIngredientIds?.length) {
			return res
				.status(400)
				.json({
					error:
						"At least one of includeIngredientIds or excludeIngredientIds must be provided",
				});
		}

		// Build the query
		const query = {};

		// Include ingredients query
		if (includeIngredientIds?.length > 0) {
			query.ingredients = {
				$all: includeIngredientIds.map((id) => ({ $elemMatch: { _id: id } })),
			};
		}

		// Exclude ingredients query
		if (excludeIngredientIds?.length > 0) {
			query.ingredients = {
				...query.ingredients,
				$not: {
					$elemMatch: { _id: { $in: excludeIngredientIds } },
				},
			};
		}

		// Find recipes based on the query
		const recipes = await Recipe.find(query).sort({ name: 1 });

		if (recipes.length === 0) {
			return res.status(404).json({ error: "No recipes found" });
		}

		res.json(recipes);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Export your controller functions
module.exports = {
	searchByRecipeName,
	searchRecipesByUserName,
	searchByNutrients,
	searchRecipesByIngredients,
};
