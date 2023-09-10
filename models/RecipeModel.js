const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // change ingredients to refs after seeding ingredients database
    ingredients: [{
        type: String,
        required: true
    }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user who created the recipe,
    isBowl: {
        type: Boolean,
        default: false
    },
    toppings: [toppingSchema]
  });

  module.exports = mongoose.model('recipe', recipeSchema)