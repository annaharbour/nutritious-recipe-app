const express = require('express');
const {searchByNutrients, searchByRecipeName, searchRecipesByUserName, searchRecipesByIngredients } = require('../controllers/searchController');
const router = express.Router();


// Route for sorting by price
router.get('/nutrients', searchByNutrients);
router.get('/recipeName', searchByRecipeName);
router.get('/userName', searchRecipesByUserName);
router.get('/ingredients', searchRecipesByIngredients);

module.exports = router;
