const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ['fruit', 'vegetable', 'fat', 'protein', 'superfood', 'liquid'] },
    nutrition: {
      amount: {type: Number, required: true},
      unit: {type: String, required: true, enum: ['whole', 'tablespoon', 'scoop', 'cup']},
      calories: {type: Number, required: true},
      macros: {
        protein: {type: Number, required: true},
        fat: {
          total: {type: Number, required: true},
          saturated: {type: Number, required: true},
          monounsaturated: {type: Number, required: true},
          polyunsaturated: {type: Number, required: true}
        },
        carbohydrates: {
          total: {type: Number, required: true},
          fiber: {type: Number, required: true},
          sugar: {type: Number, required: true},
        },
      },
        minerals: {
          calcium: {type: Number, required: true},
          iron: {type: Number, required: true},
          magnesium: {type: Number, required: true},
          phosphorus: {type: Number, required: true},
          potassium: {type: Number, required: true},
          sodium: {type: Number, required: true},
          zinc: {type: Number, required: true},
          copper: {type: Number, required: true},
          manganese: {type: Number, required: true}
        },
        vitamins: {
          vitaminA: {type: Number, required: true},
          vitaminB6: {type: Number, required: true},
          vitaminC: {type: Number, required: true},
          vitaminE: {type: Number, required: true},
          vitaminK: {type: Number, required: true},
          thiamin: {type: Number, required: true},
          riboflavin: {type: Number, required: true},
          niacin: {type: Number, required: true},
          folate: {type: Number, required: true}
        }
      }
  });

  module.exports =  mongoose.model('ingredient', ingredientSchema);
