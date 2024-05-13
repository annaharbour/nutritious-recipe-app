 const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  category: String,
  foodClass: String,
  description: String,
  foodNutrients: [{
    _id: Number,
    name: String,
    amount: Number,
    unitName: String
  }],
  foodPortions: [{
    _id: Number,
    sequenceNumber: Number,
    modifier: String,
    amount: String,
    gramWeight: Number,
  }]
});

  module.exports =  mongoose.model('ingredient', ingredientSchema);
