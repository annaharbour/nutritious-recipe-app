const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const checkObjectId = require('../middleware/checkObjectId');
const Ingredient = require('../models/IngredientModel'); // Import your Mongoose Ingredient model

// Route to get all ingredients
router.get('/', async (req, res) => {
    try {
      const ingredients = await Ingredient.find(); // Fetch all ingredients from the database
      res.json(ingredients); // Return the ingredients as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
// Route to fetch ingredient categories
router.get('/categories', async (req, res) => {
  try {
    // Query database to get a list of unique categories
    const categories = await Ingredient.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get ingredients by category
router.get('/:category', async (req, res) => {
    const category = req.params.category; // Extract the category from the URL parameter
    try {
      const ingredients = await Ingredient.find({ category }); // Fetch ingredients by category
      res.json(ingredients); // Return the filtered ingredients as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  
  router.get('/:id', async (req, res) => {
    const ingredientId = req.params.id; // Extract the ingredient ID from the URL parameter
    try {
      const ingredient = await Ingredient.findById(ingredientId); // Fetch ingredient by ID
      if (!ingredient) {
        return res.status(404).json({ message: 'Ingredient not found' });
      }
      res.json(ingredient); // Return the ingredient as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
    
  module.exports = router;
  