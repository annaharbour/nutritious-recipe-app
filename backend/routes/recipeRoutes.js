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
	rateRecipe,
} = require("../controllers/recipeController");

// POST /api/recipes
// @desc Create new recipe, get all recipes
// Private / Public
router.route("/").post(auth, createRecipe).get(getRecipes);

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
router.route("/user/:userId/saved").get(getSavedRecipesByUserId);

// PUT /api/recipes/:id/save
router.route("/save/:id").put(auth, toggleSaveRecipe);
module.exports = router;

// TODO: Rate Recipe Route
router.route("/:id/rate").put(auth, rateRecipe);
