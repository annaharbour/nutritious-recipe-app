const Recipe = require("../models/RecipeModel");
const User = require("../models/UserModel");
const Ingredient = require("../models/IngredientModel");
const Rating = require("../models/RatingModel");
const Comment = require("../models/CommentModel");
const cloudFrontUrl = process.env.CLOUDFRONT_URL;

const createRecipe = async (req, res) => {
	const { name, ingredients, servings } = req.body;
	const userId = req.user.id || req.user._id;

	try {
		const populatedIngredients = await Promise.all(
			ingredients.map(async (ingredient) => {
				const ingredientData = await Ingredient.findById(ingredient._id).lean();
				if (!ingredientData) {
					throw new Error(`Ingredient with ID ${ingredient._id} not found.`);
				}

				const foodPortion = ingredientData.foodPortions.find(
					(portion) =>
						portion._id.toString() === ingredient.portionId.toString()
				);

				const imageUrl = `${cloudFrontUrl}/images/ingredients/${ingredientData.imageUrl}`;

				return {
					...ingredient,
					description: ingredientData.description,
					category: ingredientData.category,
					modifier: foodPortion ? foodPortion.modifier : "g",
					gramWeight: foodPortion ? foodPortion.gramWeight : 100,
					imageUrl: imageUrl,
				};
			})
		);

		const newRecipe = new Recipe({
			name: name,
			ingredients: populatedIngredients,
			servings: servings,
			userId: userId,
		});

		await newRecipe.calculateNutrition();
		await newRecipe.save();

		// Update user with the new recipe
		await User.findByIdAndUpdate(userId, { $push: { recipes: newRecipe._id } });

		res.status(201).json(newRecipe);
	} catch (error) {
		console.error("Error creating recipe:", error);
		res.status(500).json({ error: "Error creating recipe" });
	}
};

const calculateRecipeNutrition = async (req, res) => {
	const { ingredients, servings } = req.body;
	try {
		const populatedIngredients = await Promise.all(
			ingredients.map(async (ingredient) => {
				const ingredientData = await Ingredient.findById(ingredient._id).lean();
				if (!ingredientData) {
					throw new Error(`Ingredient with ID ${ingredient._id} not found.`);
				}

				const foodPortion = ingredientData.foodPortions.find(
					(portion) =>
						portion._id.toString() === ingredient.portionId.toString()
				);

				return {
					...ingredient,
					description: ingredientData.description,
					category: ingredientData.category,
					modifier: foodPortion ? foodPortion.modifier : "g",
					gramWeight: foodPortion ? foodPortion.gramWeight : 100,
				};
			})
		);

		const newRecipe = new Recipe({
			ingredients: populatedIngredients,
			servings: servings,
		});

		const recipe = await newRecipe.calculateNutrition();
		res.status(201).json(recipe);
	} catch (error) {
		console.error("Error creating recipe:", error);
		res.status(500).json({ error: "Error creating recipe" });
	}
};

const getRecipes = async (req, res) => {
	try {
		const recipes = await Recipe.aggregate([
			{
				$lookup: {
					from: "ratings",
					localField: "_id",
					foreignField: "recipe",
					as: "recipeRatings",
				},
			},
			{
				$addFields: {
					averageRating: {
						$cond: {
							if: { $gt: [{ $size: "$recipeRatings" }, 0] },
							then: { $avg: "$recipeRatings.meanRating" },
							else: 0,
						},
					},
				},
			},
			{
				$sort: { averageRating: -1 },
			},
			{
				$limit: 10,
			},
			{
				$project: {
					name: 1,
					userId: 1,
					servings: 1,
					ingredients: 1,
					nutrition: 1,
					labels: 1,
					createDate: 1,
					averageRating: 1,
				},
			},
		]);

		return res.json(recipes);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Failed to fetch recipes." });
	}
};

const updateRecipeById = async (req, res) => {
	const recipeId = req.params.id;
	const { name, ingredients } = req.body;

	try {
		// Instantiate an array to store the updated ingredients
		const updatedIngredients = [];
		// Loop through the ingredients and populate them with the necessary data
		for (const ingredient of ingredients) {
			const foundIngredient = await Ingredient.findById(ingredient._id).lean();
			if (!foundIngredient) {
				throw new Error(`Ingredient with ID ${ingredient._id} not found.`);
			}
			// Find the food portion for the ingredient
			const foodPortion = foundIngredient.foodPortions.find(
				(portion) => portion._id.toString() === ingredient.portionId.toString()
			);

			// Update the ingredient with the necessary updates to the data
			updatedIngredients.push({
				_id: foundIngredient._id,
				amount: ingredient.amount,
				portionId: ingredient.portionId,
				category: foundIngredient.category,
				description: foundIngredient.description,
				modifier: foodPortion ? foodPortion.modifier : "100g",
				gramWeight: foodPortion ? foodPortion.gramWeight : 100,
			});
		}

		// Update the recipe with the new data
		const updatedRecipe = await Recipe.findByIdAndUpdate(
			recipeId,
			{ name, ingredients: updatedIngredients },
			{ new: true }
		);

		await updatedRecipe.calculateNutrition();
		await updatedRecipe.save();
		return res.status(200).json(updatedRecipe);
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

const getRecipeById = async (req, res) => {
	const recipeId = req.params.id;
	try {
		const recipe = await Recipe.findById(recipeId);
		if (!recipe) {
			return res.status(404).json({ error: "Recipe not found." });
		}

		return res.json(recipe);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const getRecipesByUserId = async (req, res) => {
	const userId = req.params.userId;
	try {
		const recipes = await Recipe.find({ userId: userId });
		return recipes
			? res.status(200).json(recipes)
			: res.status(404).json({ error: "No recipes found." });
	} catch (err) {
		return res.status(500).json({ error: "Failed to fetch recipes." });
	}
};

const deleteRecipeById = async (req, res) => {
	const recipeId = req.params.id;

	try {
		const recipe = await Recipe.findById(recipeId);
		if (!recipe) {
			return res.status(404).json({ error: "Recipe not found." });
		}

		await Promise.all([
			Rating.deleteMany({ recipe: recipeId }),
			Comment.deleteMany({ recipe: recipeId }),
			User.updateMany({}, { $pull: { favoriteRecipes: recipeId } }),
		]);

		await recipe.deleteOne();

		return res.status(200).json({ message: "Recipe removed" });
	} catch (err) {
		console.error(err); // Log the error for debugging purposes
		return res.status(500).json({ error: "Failed to delete the recipe." });
	}
};

const getSavedRecipesByUserId = async (req, res) => {
	const userId = req.params.userId;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}
		const favoriteRecipes = await Recipe.find({
			_id: { $in: user.favoriteRecipes },
		});

		// Find the recipes that the user has saved
		return favoriteRecipes ? res.status(200).json(favoriteRecipes) : [];
	} catch (err) {
		return res.status(500).json({ error: "Failed to fetch recipes." });
	}
};

const toggleSaveRecipe = async (req, res) => {
	const userId = req.user.id || req.user._id;
	const recipeId = req.params.id;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}
		// Check if the recipe is already saved and toggle the save
		const alreadySaved = user.favoriteRecipes.includes(recipeId);
		if (alreadySaved) {
			user.favoriteRecipes.pull(recipeId);
		} else {
			user.favoriteRecipes.push(recipeId);
		}
		await user.save();
		return res.status(200).json(user.favoriteRecipes);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};
const searchRecipes = async (req, res) => {
    const { recipeName, userName, includeIngredients, excludeIngredients, optimizations } = req.query;

    try {
        // Build query object
        let query = {};

        // Recipe name matching
        if (recipeName) {
            query.name = { $regex: recipeName, $options: "i" };
        }

        // User name matching
        if (userName) {
            const user = await User.findOne({ username: userName });
            if (user) {
                query.userId = user._id;
            }
        }

        // Ingredients logic
        const ingredientQuery = [];

        // Include ingredients
        if (includeIngredients) {
            const includeArray = includeIngredients.split(",");
            ingredientQuery.push({ "ingredients._id": { $all: includeArray } }); // Must include all specified ingredients
        }

        // Exclude ingredients
        if (excludeIngredients) {
            const excludeArray = excludeIngredients.split(",");
            ingredientQuery.push({ "ingredients._id": { $nin: excludeArray } }); // Must not include any specified ingredients
        }

        // Combine include and exclude conditions
        if (ingredientQuery.length > 0) {
            query.$and = ingredientQuery;
        }

        // Optimizations handling
        if (optimizations) {
            const optimizationObject = JSON.parse(optimizations);

            const tags = [];
            if (optimizationObject.bulking) tags.push("Bulking");
            if (optimizationObject.lean) tags.push("Lean");
            if (optimizationObject.highProtein) tags.push("High Protein");
            if (optimizationObject.lowCarb) tags.push("Low Carb");
            if (optimizationObject.lowFat) tags.push("Low Fat");

            if (tags.length > 0) {
                query.labels = { $all: tags }; 
            }
        }
        const recipes = await Recipe.find(query).lean();
        res.json(recipes);
    } catch (err) {
        console.error("Error searching recipes:", err);
        res.status(500).json({ error: "Error searching recipes" });
    }
};


module.exports = {
	createRecipe,
	calculateRecipeNutrition,
	getRecipes,
	getRecipeById,
	updateRecipeById,
	deleteRecipeById,
	getRecipesByUserId,
	getSavedRecipesByUserId,
	toggleSaveRecipe,
	searchRecipes,
};
