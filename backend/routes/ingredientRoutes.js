const express = require("express");
const router = express.Router();
const {
	getAllIngredients,
	getIngredientsByCategory,
	getIngredientById,
	getIngredientNutrition
} = require("../controllers/ingredientController");


// Route to get ingredients by category
router.get("/:category", getIngredientsByCategory);

// Get ingredient by id
router.get("/:id", getIngredientById);

// Get ingredient nutrition by portion / amount
router.get("/:id/:portionId", getIngredientNutrition);


// Route to get all ingredients
router.get("/", getAllIngredients);

module.exports = router;
