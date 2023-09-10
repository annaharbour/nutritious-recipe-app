const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Recipe = require('../models/RecipeModel');
  
// POST /api/recipes
// @desc Create new recipe
// Private
router.post('/', auth, [
  check('ingredients', 'Please include at least one ingredient').isArray({ min: 1 }),
  check('isBowl', 'isSmoothieBowl must be a boolean').isBoolean(),
  check('toppings', 'Toppings must be an array if it is a smoothie bowl').optional().isArray(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, ingredients, isBowl, toppings } = req.body;
  const userId = req.user.id; 
  
  const newRecipe = new Recipe({
    name,
    ingredients,
    userId,
    isBowl,
    toppings,
  });

  newRecipe.save()
    .then((recipe) => res.json(recipe))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to create the recipe.' });
    });
});


// GET /api/recipes
// @desc Get all recipes
// Private
router.get('/all', auth, (req, res) => {
    Recipe.find()
      .then((recipes) => res.json(recipes))
      .catch((err) => res.status(500).json({ error: 'Failed to fetch recipes.' }));
  });
  
  // GET /api/recipes/:id
  // Get recipe by id
router.get('/:id', (req, res) => {
    const recipeId = req.params.id;
  
    Recipe.findById(recipeId)
      .then((recipe) => {
        if (!recipe) {
          return res.status(404).json({ error: 'Recipe not found.' });
        }
        res.json(recipe);
      })
      .catch((err) => res.status(500).json({ error: 'Failed to fetch the recipe.' }));
  });

  // PUT /api/recipes/:id
  //@desc Update a recipe
  //Private
router.put('/:id', auth, [
    check('fruit', 'Please include at least one fruit').notEmpty(),
    check('vegetable', 'Please include at least one vegetable').notEmpty(),
    check('protein', 'Please include at least one protein source').notEmpty(),
    check('fat', 'Please include at least one healthy fat source').notEmpty()
  ], (req, res) => {
    const recipeId = req.params.id;
    const { name, ingredients, isSmoothieBowl, toppings } = req.body;
  
    Recipe.findByIdAndUpdate(recipeId, { name, ingredients, isSmoothieBowl, toppings }, { new: true })
      .then((updatedRecipe) => {
        if (!updatedRecipe) {
          return res.status(404).json({ error: 'Recipe not found.' });
        }
        res.json(updatedRecipe);
      })
      .catch((err) => res.status(500).json({ error: 'Failed to update the recipe.' }));
  });

  // DELETE /api/recipes/:id
  //@desc Delete a recipe
  //Private
router.delete('/:id', auth, (req, res) => {
    const recipeId = req.params.id;
  
    Recipe.findByIdAndDelete(recipeId)
      .then((deletedRecipe) => {
        if (!deletedRecipe) {
          return res.status(404).json({ error: 'Recipe not found.' });
        }
        res.json({ message: 'Recipe deleted successfully.' });
      })
      .catch((err) => res.status(500).json({ error: 'Failed to delete the recipe.' }));
  });
    
  module.exports = router;
