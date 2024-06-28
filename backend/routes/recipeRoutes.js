const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
	createRecipe,
	calculateRecipeNutrition,
	getRecipeById,
	updateRecipeById,
	deleteRecipeById,
	getRecipes,
	getRecipesByUserId,
	getSavedRecipesByUserId,
	toggleSaveRecipe,
	searchRecipes,
} = require("../controllers/recipeController");
const {
	rateRecipe,
	getRating,
	getUserRatings,
} = require("../controllers/ratingController");
const { getUserFavorites } = require("../controllers/userController");

// POST /api/recipes
// @desc Create new recipe, get all recipes
// Private / Public
router.route("/").post(auth, createRecipe).get(getRecipes);

// Get /search
// @desc Get recipes with query parameters
// recipe name, user name, nutrients parameters (greater/less than), include or exclude ingredients, sort asc / desc
// @access Public
router.route("/search").get(searchRecipes);

router.route("/nutrition").post(calculateRecipeNutrition);

// PUT /api/recipes/:id
//@desc Read, update, delete a recipe
//Private


router
	.route("/:id")
	.get(getRecipeById)
	.put(auth, updateRecipeById)
	.delete(auth, deleteRecipeById);



// GET /api/recipes/user/:userId
router.route("/user/:userId").get(getRecipesByUserId);


// GET /api/recipes/user/:userId/favorites
router.route("/user/:userId/saved").get(getUserFavorites);

// PUT /api/recipes/:id/save
router.route("/save/:id").put(auth, toggleSaveRecipe);

// PUT /recipes/:recipeId/rating
// @desc Rate a recipe
// @access Private
// GET /recipes/:recipeId/rating
// @desc Get recipe rating
// @access Private
router.route("/:recipeId/rating").put(auth, rateRecipe).get(auth, getRating);

// Get /users/:id/rating
// @desc Get user rating
// @access Private
router.route("/:userId/ratings").get(auth, getUserRatings);


module.exports = router;
