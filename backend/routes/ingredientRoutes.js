const express = require("express");
const router = express.Router();
const {
	getAllIngredients,
	getIngredientsByCategory,
	getIngredientById,
} = require("../controllers/ingredientController");

// Route to get all ingredients
router.get("/", getAllIngredients);

// Route to get ingredients by category
router.get("/:category", getIngredientsByCategory);

router.get("/:id", getIngredientById);

module.exports = router;
