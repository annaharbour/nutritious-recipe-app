const Recipe = require("../models/RecipeModel");
const User = require("../models/UserModel");
const Ingredient = require("../models/IngredientModel");

const calculateRecipeNutrition = async (req, res) => {
	const { ingredients } = req.body;
	if (!ingredients) {
		return res.status(400).json({ error: "Ingredients are required" });
	}

	// Calculate the total nutrition for the recipe
	try {
		// Populate the ingredients with the necessary data
		const populatedIngredients = await Promise.all(
			// Promise.all will wait for all ingredient data to be fetched before continuing
			ingredients.map(async (ingredient) => {
				const ingredientData = await Ingredient.findById(ingredient._id).lean();
				if (!ingredientData) {
					throw new Error(`Ingredient with ID ${ingredient._id} not found.`);
				}
				// Find the food portion for the ingredient
				const foodPortion = ingredientData.foodPortions.find(
					(portion) =>
						portion._id.toString() === ingredient.portionId.toString()
				);

				// Return the ingredient with the necessary data
				return {
					...ingredient,
					description: ingredientData.description,
					category: ingredientData.category,
					modifier: foodPortion ? foodPortion.modifier : "g",
					gramWeight: foodPortion ? foodPortion.gramWeight : "100",
				};
			})
		);

		// Construct a recipe with the populated ingredients
		const recipe = new Recipe({
			ingredients: populatedIngredients,
		});

		// Calculate the total nutrition for the recipe without saving
		const totalNutrition = await recipe.calculateNutrition();

		return res.json(totalNutrition);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const createRecipe = async (req, res) => {
	const { name, ingredients } = req.body;
	const userId = req.user.id;

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
					gramWeight: foodPortion ? foodPortion.gramWeight : 100, // Assuming default 100g if not found
				};
			})
		);

		const newRecipe = new Recipe({
			name: name,
			ingredients: populatedIngredients,
			userId: userId,
		});

		try {
			const user = await User.findById(userId);
			user.recipes.push(newRecipe._id);
			await user.save();
		} catch (err) {
			console.error("Error saving recipe to user:", err);
			return res.status(500).json({ error: "Error saving recipe to user." });
		}
		await newRecipe.calculateNutrition();
		await newRecipe.save();
		res.status(201).json(newRecipe);
	} catch (error) {
		console.error("Error creating recipe:", error);
		res.status(500).json({ error: "Error creating recipe" });
	}
};

const getRecipes = async (req, res) => {
	try {
		const recipes = await Recipe.find();
		return res.json(recipes);
	} catch (err) {
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
		const recipe = await Recipe.findByIdAndRemove(recipeId);
		if (!recipe) {
			return res.status(404).json({ error: "Recipe not found." });
		}
		return res.status(200).json({ message: "Recipe removed" });
	} catch (err) {
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
		// Find the recipes that the user has saved
		const favoriteRecipes = await Recipe.find({
			_id: { $in: user.favoriteRecipes },
		});
		// Return the favorite recipes if found
		return favoriteRecipes && favoriteRecipes.length > 0
			? res.status(200).json(favoriteRecipes)
			: res.status(404).json({ error: "No favorite recipes found." });
	} catch (err) {
		return res.status(500).json({ error: "Failed to fetch recipes." });
	}
};

const toggleSaveRecipe = async (req, res) => {
	const userId = req.user.id;
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

const getUserRating = (ratings, userId) => {
	return ratings.find(rating => rating.user && rating.user.toString() === userId);
}

const rateRecipe = async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.id;
    const { numStars } = req.body;

    // Check if the rating is between 1 and 5 stars
    if (numStars < 1 || numStars > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5 stars." });
    }

    try {
		// Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

		// Find recipe
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found." });
        }

        // Remove previous rating from user if it exists
        recipe.ratings = recipe.ratings.filter(rating => {
            return rating.user && rating.user.toString() !== userId;
        });

        // Add new rating
        recipe.ratings.push({ user: userId, rating: numStars });

        // Calculate the mean rating
        const totalRatings = recipe.ratings.length;
        const totalPoints = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
        recipe.meanRating = totalRatings ? (totalPoints / totalRatings).toFixed(2) : null;

        await recipe.save();
        return res.status(200).json(recipe);
    } catch (err) {
        return res.status(500).json({ error: err.message });
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
	rateRecipe,
	getUserRating,
};
