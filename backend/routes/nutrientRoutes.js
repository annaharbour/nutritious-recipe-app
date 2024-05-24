const express = require("express");
const router = express.Router();
const { getAllNutrients, getNutrientById, getIngredientsByNutrient } = require("../controllers/nutrientController");

// Route to get all nutrients
router.get("/", getAllNutrients);

// Get nutrient by id
router.get("/:id", getNutrientById);

// Get ingredients by nutrient
router.get("/:nutrientId/ingredients", getIngredientsByNutrient);

module.exports = router;