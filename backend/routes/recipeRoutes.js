const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
	createRecipe,
	getRecipeById,
	updateRecipeById,
	deleteRecipeById,
	getRecipes,
} = require("../controllers/recipeController");

// POST /api/recipes
// @desc Create new recipe, get all recipes
// Private / Public
router.route("/").post(auth, createRecipe).get(getRecipes);

// PUT /api/recipes/:id
//@desc Read, update, delete a recipe
//Private
router
	.route("/:id")
	.get(getRecipeById)
	.put(auth, updateRecipeById)
	.delete(auth, deleteRecipeById);

module.exports = router;
