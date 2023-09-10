const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const Ingredient = require('../models/IngredientModel'); // Import your Ingredient model

const ingredientsData = [
  // Fruits
  {
    name: 'Apple',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'whole',
      calories: 95,
      macros: {
        protein: 0.5,
        fat: {
          total: 0.3,
          saturated: 0.1,
          monounsaturated: 0.02,
          polyunsaturated: 0.05
          },
        carbohydrates: {
          total: 25,
          fiber: 4.4,
          sugar: 19
          },
        },
        minerals: {
          calcium: 11,
          iron: 0.2,
          magnesium: 9,
          phosphorus: 20,
          potassium: 195,
          sodium: 2,
          zinc: 0.05,
          copper: 0.04,
          manganese: 0.064
        },
        vitamins: {
          vitaminA: 98,
          vitaminB6: 0.041,
          vitaminC: 8.4,
          vitaminE: 0.18,
          vitaminK: 0.5,
          thiamin: 0.017,
          riboflavin: 0.026,
          niacin: 0.091,
          folate: 3
        }
    } 
  },
  {
    name: 'Banana',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'whole',
      calories: 105,
      macros: {
        protein: 1.3,
        fat: {
          total: 0.4,
          saturated: 0.1,
          monounsaturated: 0.1,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 27,
          fiber: 3.1,
          sugar: 14
        }
      },
      minerals: {
        calcium: 5,
        iron: 0.3,
        magnesium: 27,
        phosphorus: 22,
        potassium: 422,
        sodium: 1,
        zinc: 0.2,
        copper: 0.1,
        manganese: 0.3
      },
      vitamins: {
        vitaminA: 64,
        vitaminB6: 0.4,
        vitaminC: 14.6,
        vitaminE: 0.1,
        vitaminK: 0.5,
        thiamin: 0.04,
        riboflavin: 0.1,
        niacin: 0.7,
        folate: 20
      }
    }
  },
  {
    name: 'Blackberries',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 62,
      macros: {
        protein: 2,
        fat: {
          total: 0.7,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.4
        },
        carbohydrates: {
          total: 14,
          fiber: 8,
          sugar: 7
        }
      },
      minerals: {
        calcium: 42,
        iron: 0.9,
        magnesium: 29,
        phosphorus: 28,
        potassium: 233,
        sodium: 1,
        zinc: 0.5,
        copper: 0.2,
        manganese: 0.9
      },
      vitamins: {
        vitaminA: 308,
        vitaminB6: 0.05,
        vitaminC: 30.2,
        vitaminE: 1.3,
        vitaminK: 29,
        thiamin: 0.03,
        riboflavin: 0.04,
        niacin: 1.3,
        folate: 36
      }
    }
  },
  {
    name: 'Blueberries',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 84,
      macros: {
        protein: 1.1,
        fat: {
          total: 0.5,
          saturated: 0.0,
          monounsaturated: 0.1,
          polyunsaturated: 0.3
        },
        carbohydrates: {
          total: 21,
          fiber: 3.6,
          sugar: 15
        }
      },
      minerals: {
        calcium: 9,
        iron: 0.4,
        magnesium: 9,
        phosphorus: 18,
        potassium: 114,
        sodium: 1,
        zinc: 0.2,
        copper: 0.1,
        manganese: 0.5
      },
      vitamins: {
        vitaminA: 80,
        vitaminB6: 0.05,
        vitaminC: 14.4,
        vitaminE: 0.8,
        vitaminK: 29,
        thiamin: 0.04,
        riboflavin: 0.04,
        niacin: 0.4,
        folate: 9
      }
    }
  },
  {
    name: 'Cantaloupe',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 53,
      macros: {
        protein: 1.3,
        fat: {
          total: 0.3,
          saturated: 0.1,
          monounsaturated: 0.1,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 13,
          fiber: 1.5,
          sugar: 12
        }
      },
      minerals: {
        calcium: 16,
        iron: 0.3,
        magnesium: 18,
        phosphorus: 15,
        potassium: 417,
        sodium: 16,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 5626,
        vitaminB6: 0.1,
        vitaminC: 58.7,
        vitaminE: 0.2,
        vitaminK: 3,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.9,
        folate: 14
      }
    }
  },
  {
    name: 'Cherries',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 87,
      macros: {
        protein: 1.6,
        fat: {
          total: 0.5,
          saturated: 0.0,
          monounsaturated: 0.1,
          polyunsaturated: 0.3
        },
        carbohydrates: {
          total: 22,
          fiber: 3.2,
          sugar: 18
        }
      },
      minerals: {
        calcium: 25,
        iron: 0.5,
        magnesium: 15,
        phosphorus: 31,
        potassium: 342,
        sodium: 0,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 1649,
        vitaminB6: 0.1,
        vitaminC: 15.5,
        vitaminE: 0.1,
        vitaminK: 3,
        thiamin: 0.0,
        riboflavin: 0.1,
        niacin: 0.6,
        folate: 10
      }
    }
  },
  {
    name: 'Grapes',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 104,
      macros: {
        protein: 1.1,
        fat: {
          total: 0.2,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 27,
          fiber: 1.4,
          sugar: 23
        }
      },
      minerals: {
        calcium: 15,
        iron: 0.6,
        magnesium: 7,
        phosphorus: 20,
        potassium: 288,
        sodium: 3,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 66,
        vitaminB6: 0.1,
        vitaminC: 14.8,
        vitaminE: 0.2,
        vitaminK: 22,
        thiamin: 0.0,
        riboflavin: 0.1,
        niacin: 0.1,
        folate: 3
      }
    }
  },
  {
    name: 'Guava',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'whole',
      calories: 37,
      macros: {
        protein: 1.4,
        fat: {
          total: 0.5,
          saturated: 0.1,
          monounsaturated: 0.1,
          polyunsaturated: 0.2
        },
        carbohydrates: {
          total: 9,
          fiber: 3,
          sugar: 5
        }
      },
      minerals: {
        calcium: 9,
        iron: 0.4,
        magnesium: 22,
        phosphorus: 26,
        potassium: 229,
        sodium: 1,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 624,
        vitaminB6: 0.1,
        vitaminC: 209,
        vitaminE: 0.2,
        vitaminK: 2.6,
        thiamin: 0.1,
        riboflavin: 0.1,
        niacin: 1.2,
        folate: 29
      }
    }
  },
  {
    name: 'Honeydew',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 64,
      macros: {
        protein: 0.9,
        fat: {
          total: 0.2,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 16,
          fiber: 1.4,
          sugar: 14
        }
      },
      minerals: {
        calcium: 18,
        iron: 0.4,
        magnesium: 15,
        phosphorus: 15,
        potassium: 388,
        sodium: 18,
        zinc: 0.1,
        copper: 0.0,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 1326,
        vitaminB6: 0.1,
        vitaminC: 31,
        vitaminE: 0.1,
        vitaminK: 5,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.7,
        folate: 31
      }
    }
  },
  {
    name: 'Mango',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 99,
      macros: {
        protein: 1.4,
        fat: {
          total: 0.6,
          saturated: 0.1,
          monounsaturated: 0.1,
          polyunsaturated: 0.2
        },
        carbohydrates: {
          total: 25,
          fiber: 3,
          sugar: 24
        }
      },
      minerals: {
        calcium: 16,
        iron: 0.2,
        magnesium: 19,
        phosphorus: 23,
        potassium: 257,
        sodium: 3,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 1785,
        vitaminB6: 0.2,
        vitaminC: 60,
        vitaminE: 1.8,
        vitaminK: 8.7,
        thiamin: 0.1,
        riboflavin: 0.1,
        niacin: 1.2,
        folate: 71
      }
    }
  },
  {
    name: 'Nectarine',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'whole',
      calories: 60,
      macros: {
        protein: 1.5,
        fat: {
          total: 0.4,
          saturated: 0.0,
          monounsaturated: 0.1,
          polyunsaturated: 0.2
        },
        carbohydrates: {
          total: 14,
          fiber: 2.4,
          sugar: 11
        }
      },
      minerals: {
        calcium: 6,
        iron: 0.3,
        magnesium: 9,
        phosphorus: 29,
        potassium: 285,
        sodium: 0,
        zinc: 0.2,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 331,
        vitaminB6: 0.1,
        vitaminC: 7.7,
        vitaminE: 1.4,
        vitaminK: 3.1,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 1.6,
        folate: 5
      }
    }
  },
  {
    name: 'Orange',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'whole',
      calories: 62,
      macros: {
        protein: 1.2,
        fat: {
          total: 0.2,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 15,
          fiber: 3.1,
          sugar: 12
        }
      },
      minerals: {
        calcium: 52,
        iron: 0.1,
        magnesium: 15,
        phosphorus: 15,
        potassium: 237,
        sodium: 0,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 317,
        vitaminB6: 0.1,
        vitaminC: 70,
        vitaminE: 0.2,
        vitaminK: 0.2,
        thiamin: 0.1,
        riboflavin: 0.1,
        niacin: 0.5,
        folate: 40
      }
    }
  },
  {
    name: 'Passionfruit',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 97,
      macros: {
        protein: 2.2,
        fat: {
          total: 0.7,
          saturated: 0.2,
          monounsaturated: 0.3,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 23,
          fiber: 24,
          sugar: 11
        }
      },
      minerals: {
        calcium: 12,
        iron: 2.2,
        magnesium: 29,
        phosphorus: 68,
        potassium: 892,
        sodium: 28,
        zinc: 0.1,
        copper: 0.3,
        manganese: 0.9
      },
      vitamins: {
        vitaminA: 1274,
        vitaminB6: 0.1,
        vitaminC: 101,
        vitaminE: 0.3,
        vitaminK: 29,
        thiamin: 0.1,
        riboflavin: 0.2,
        niacin: 1.5,
        folate: 68
      }
    }
  },
  {
    name: 'Pear',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'whole',
      calories: 102,
      macros: {
        protein: 0.6,
        fat: {
          total: 0.2,
          saturated: 0.0,
          monounsaturated: 0.1,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 27,
          fiber: 5.5,
          sugar: 17
        }
      },
      minerals: {
        calcium: 12,
        iron: 0.2,
        magnesium: 7,
        phosphorus: 18,
        potassium: 206,
        sodium: 2,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 56,
        vitaminB6: 0.1,
        vitaminC: 7.5,
        vitaminE: 0.2,
        vitaminK: 6,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.2,
        folate: 7
      }
    }
  },
  {
    name: 'Pineapple',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 82,
      macros: {
        protein: 0.9,
        fat: {
          total: 0.2,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 21,
          fiber: 2.3,
          sugar: 16
        }
      },
      minerals: {
        calcium: 21,
        iron: 0.5,
        magnesium: 19,
        phosphorus: 13,
        potassium: 180,
        sodium: 2,
        zinc: 0.2,
        copper: 0.1,
        manganese: 1.4
      },
      vitamins: {
        vitaminA: 131,
        vitaminB6: 0.2,
        vitaminC: 131,
        vitaminE: 0.0,
        vitaminK: 1.2,
        thiamin: 0.1,
        riboflavin: 0.0,
        niacin: 0.5,
        folate: 29
      }
    }
  },
  {
    name: 'Plum',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'whole',
      calories: 46,
      macros: {
        protein: 0.6,
        fat: {
          total: 0.2,
          saturated: 0.0,
          monounsaturated: 0.1,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 11,
          fiber: 1.4,
          sugar: 9
        }
      },
      minerals: {
        calcium: 6,
        iron: 0.2,
        magnesium: 7,
        phosphorus: 16,
        potassium: 104,
        sodium: 0,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 569,
        vitaminB6: 0.0,
        vitaminC: 10.6,
        vitaminE: 0.2,
        vitaminK: 6.4,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.4,
        folate: 5
      }
    }
  },
  {
    name: 'Raspberries',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 64,
      macros: {
        protein: 1.5,
        fat: {
          total: 0.8,
          saturated: 0.0,
          monounsaturated: 0.1,
          polyunsaturated: 0.5
        },
        carbohydrates: {
          total: 14.7,
          fiber: 8,
          sugar: 5.4
        }
      },
      minerals: {
        calcium: 30,
        iron: 0.8,
        magnesium: 27,
        phosphorus: 29,
        potassium: 186,
        sodium: 1,
        zinc: 0.5,
        copper: 0.1,
        manganese: 1.3
      },
      vitamins: {
        vitaminA: 40,
        vitaminB6: 0.1,
        vitaminC: 54.6,
        vitaminE: 1.0,
        vitaminK: 9.6,
        thiamin: 0.0,
        riboflavin: 0.1,
        niacin: 0.7,
        folate: 14
      }
    }
  },
  {
    name: 'Strawberries',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 49,
      macros: {
        protein: 1,
        fat: {
          total: 0.4,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.2
        },
        carbohydrates: {
          total: 11,
          fiber: 3,
          sugar: 7
        }
      },
      minerals: {
        calcium: 27,
        iron: 0.7,
        magnesium: 22,
        phosphorus: 40,
        potassium: 233,
        sodium: 2,
        zinc: 0.2,
        copper: 0.1,
        manganese: 1.0
      },
      vitamins: {
        vitaminA: 28,
        vitaminB6: 0.1,
        vitaminC: 89.4,
        vitaminE: 0.4,
        vitaminK: 3,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.4,
        folate: 29
      }
    }
  },
  {
    name: 'Watermelon',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 46,
      macros: {
        protein: 0.9,
        fat: {
          total: 0.2,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 11,
          fiber: 0.6,
          sugar: 9
        }
      },
      minerals: {
        calcium: 11,
        iron: 0.4,
        magnesium: 10,
        phosphorus: 9,
        potassium: 170,
        sodium: 2,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 569,
        vitaminB6: 0.1,
        vitaminC: 12.5,
        vitaminE: 0.1,
        vitaminK: 0.2,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.2,
        folate: 3
      }
    }
  },
  
  // Vegetables by cup
  {
    name: 'Broccoli',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 55,
      macros: {
        protein: 4.4,
        fat: {
          total: 0.6,
          saturated: 0.1,
          monounsaturated: 0.0,
          polyunsaturated: 0.3
        },
        carbohydrates: {
          total: 11,
          fiber: 2.6,
          sugar: 1.7
        }
      },
      minerals: {
        calcium: 71,
        iron: 1.0,
        magnesium: 19,
        phosphorus: 66,
        potassium: 316,
        sodium: 41,
        zinc: 0.6,
        copper: 0.1,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 567,
        vitaminB6: 0.2,
        vitaminC: 81.2,
        vitaminE: 0.7,
        vitaminK: 92,
        thiamin: 0.1,
        riboflavin: 0.1,
        niacin: 0.6,
        folate: 57
      }
    }
  },  
  {
    name: 'Carrots',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 52,
      macros: {
        protein: 1.2,
        fat: {
          total: 0.3,
          saturated: 0.1,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 12,
          fiber: 3.4,
          sugar: 6
        }
      },
      minerals: {
        calcium: 42,
        iron: 0.6,
        magnesium: 20,
        phosphorus: 40,
        potassium: 410,
        sodium: 88,
        zinc: 0.2,
        copper: 0.1,
        manganese: 0.3
      },
      vitamins: {
        vitaminA: 10190,
        vitaminB6: 0.2,
        vitaminC: 7.6,
        vitaminE: 0.3,
        vitaminK: 16,
        thiamin: 0.1,
        riboflavin: 0.1,
        niacin: 1.2,
        folate: 24
      }
    }
  },
  {
    name: 'Butter Lettuce',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 5,
      macros: {
        protein: 0.5,
        fat: {
          total: 0.1,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.0
        },
        carbohydrates: {
          total: 1,
          fiber: 0.5,
          sugar: 0.3
        }
      },
      minerals: {
        calcium: 10,
        iron: 0.3,
        magnesium: 3,
        phosphorus: 7,
        potassium: 68,
        sodium: 2,
        zinc: 0.1,
        copper: 0.0,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 1630,
        vitaminB6: 0.0,
        vitaminC: 6.5,
        vitaminE: 0.1,
        vitaminK: 75.8,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.1,
        folate: 25
      }
    }
  },  
  {
    name: 'Cauliflower',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 25,
      macros: {
        protein: 2,
        fat: {
          total: 0.3,
          saturated: 0.1,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 5.3,
          fiber: 2.5,
          sugar: 2.0
        }
      },
      minerals: {
        calcium: 22,
        iron: 0.4,
        magnesium: 15,
        phosphorus: 44,
        potassium: 303,
        sodium: 30,
        zinc: 0.2,
        copper: 0.1,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 0,
        vitaminB6: 0.2,
        vitaminC: 51.6,
        vitaminE: 0.1,
        vitaminK: 16,
        thiamin: 0.0,
        riboflavin: 0.1,
        niacin: 0.5,
        folate: 57
      }
    }
  },
  {
    name: 'Collard Greens',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 11,
      macros: {
        protein: 1.1,
        fat: {
          total: 0.2,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 2.2,
          fiber: 1.3,
          sugar: 0.4
        }
      },
      minerals: {
        calcium: 53,
        iron: 0.5,
        magnesium: 14,
        phosphorus: 17,
        potassium: 74,
        sodium: 4,
        zinc: 0.1,
        copper: 0.0,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 7229,
        vitaminB6: 0.1,
        vitaminC: 21.7,
        vitaminE: 0.4,
        vitaminK: 770,
        thiamin: 0.0,
        riboflavin: 0.1,
        niacin: 0.4,
        folate: 44
      }
    }
  },
  {
    name: 'Cucumber',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 16,
      macros: {
        protein: 0.8,
        fat: {
          total: 0.1,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.0
        },
        carbohydrates: {
          total: 3.7,
          fiber: 0.5,
          sugar: 1.9
        }
      },
      minerals: {
        calcium: 16,
        iron: 0.3,
        magnesium: 14,
        phosphorus: 24,
        potassium: 152,
        sodium: 2,
        zinc: 0.2,
        copper: 0.0,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 105,
        vitaminB6: 0.0,
        vitaminC: 4.5,
        vitaminE: 0.0,
        vitaminK: 16.4,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.1,
        folate: 7
      }
    }
  },
  {
    name: 'Kale',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 33,
      macros: {
        protein: 2.9,
        fat: {
          total: 0.6,
          saturated: 0.1,
          monounsaturated: 0.1,
          polyunsaturated: 0.2
        },
        carbohydrates: {
          total: 6.7,
          fiber: 1.3,
          sugar: 1.3
        }
      },
      minerals: {
        calcium: 101,
        iron: 1.1,
        magnesium: 23,
        phosphorus: 38,
        potassium: 299,
        sodium: 29,
        zinc: 0.2,
        copper: 0.2,
        manganese: 0.5
      },
      vitamins: {
        vitaminA: 10302,
        vitaminB6: 0.2,
        vitaminC: 80.4,
        vitaminE: 0.5,
        vitaminK: 547,
        thiamin: 0.1,
        riboflavin: 0.1,
        niacin: 0.7,
        folate: 19
      }
    }
  },
  {
    name: 'Mustard Greens',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 15,
      macros: {
        protein: 1.5,
        fat: {
          total: 0.2,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 2.7,
          fiber: 1.6,
          sugar: 0.6
        }
      },
      minerals: {
        calcium: 104,
        iron: 0.8,
        magnesium: 13,
        phosphorus: 18,
        potassium: 314,
        sodium: 9,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.3
      },
      vitamins: {
        vitaminA: 5880,
        vitaminB6: 0.1,
        vitaminC: 27,
        vitaminE: 1.5,
        vitaminK: 332,
        thiamin: 0.1,
        riboflavin: 0.1,
        niacin: 0.4,
        folate: 14
      }
    }
  },
  {
    name: 'Dandelion Greens',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 25,
      macros: {
        protein: 1.5,
        fat: {
          total: 0.4,
          saturated: 0.0,
          monounsaturated: 0.1,
          polyunsaturated: 0.2
        },
        carbohydrates: {
          total: 5.1,
          fiber: 1.9,
          sugar: 0.5
        }
      },
      minerals: {
        calcium: 103,
        iron: 1.7,
        magnesium: 36,
        phosphorus: 36,
        potassium: 218,
        sodium: 42,
        zinc: 0.4,
        copper: 0.2,
        manganese: 0.4
      },
      vitamins: {
        vitaminA: 5588,
        vitaminB6: 0.1,
        vitaminC: 19.3,
        vitaminE: 1.9,
        vitaminK: 428,
        thiamin: 0.1,
        riboflavin: 0.2,
        niacin: 0.8,
        folate: 14
      }
    }
  },
  {
    name: 'Spring Mix',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 6,
      macros: {
        protein: 0.6,
        fat: {
          total: 0.1,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 1.0,
          fiber: 0.2,
          sugar: 0.5
        }
      },
      minerals: {
        calcium: 13,
        iron: 0.3,
        magnesium: 6,
        phosphorus: 7,
        potassium: 80,
        sodium: 5,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 1573,
        vitaminB6: 0.0,
        vitaminC: 6.1,
        vitaminE: 0.1,
        vitaminK: 144,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.1,
        folate: 22
      }
    }
  },
  {
    name: 'Spinach',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 7,
      macros: {
        protein: 0.9,
        fat: {
          total: 0.1,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 1.1,
          fiber: 0.7,
          sugar: 0.1
        }
      },
      minerals: {
        calcium: 30,
        iron: 0.8,
        magnesium: 24,
        phosphorus: 14,
        potassium: 167,
        sodium: 24,
        zinc: 0.2,
        copper: 0.1,
        manganese: 0.9
      },
      vitamins: {
        vitaminA: 2813,
        vitaminB6: 0.1,
        vitaminC: 8.4,
        vitaminE: 0.6,
        vitaminK: 144,
        thiamin: 0.0,
        riboflavin: 0.1,
        niacin: 0.5,
        folate: 58
      }
    }
  },
  {
    name: 'Romaine Lettuce',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 8,
      macros: {
        protein: 0.6,
        fat: {
          total: 0.1,
          saturated: 0.0,
          monounsaturated: 0.0,
          polyunsaturated: 0.0
        },
        carbohydrates: {
          total: 1.5,
          fiber: 1.0,
          sugar: 0.5
        }
      },
      minerals: {
        calcium: 16,
        iron: 0.4,
        magnesium: 8,
        phosphorus: 10,
        potassium: 116,
        sodium: 6,
        zinc: 0.1,
        copper: 0.0,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 4095,
        vitaminB6: 0.0,
        vitaminC: 3.7,
        vitaminE: 0.1,
        vitaminK: 48,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.1,
        folate: 64
      }
    }
  },  
  {
    name: 'Sweet Potato',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 180,
      macros: {
        protein: 4,
        fat: {
          total: 0.2,
          saturated: 0.1,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 41.4,
          fiber: 6.6,
          sugar: 13.2
        }
      },
      minerals: {
        calcium: 39,
        iron: 1.4,
        magnesium: 54,
        phosphorus: 68,
        potassium: 950,
        sodium: 72,
        zinc: 0.4,
        copper: 0.3,
        manganese: 0.6
      },
      vitamins: {
        vitaminA: 37741,
        vitaminB6: 0.3,
        vitaminC: 22.3,
        vitaminE: 2.4,
        vitaminK: 4.5,
        thiamin: 0.1,
        riboflavin: 0.1,
        niacin: 1.7,
        folate: 22
      }
    }
  },
  {
    name: 'Zucchini',
    category: 'vegetable',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 20,
      macros: {
        protein: 1.0,
        fat: {
          total: 0.3,
          saturated: 0.1,
          monounsaturated: 0.0,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 4.0,
          fiber: 1.2,
          sugar: 2.0
        }
      },
      minerals: {
        calcium: 16,
        iron: 0.4,
        magnesium: 32,
        phosphorus: 38,
        potassium: 325,
        sodium: 8,
        zinc: 0.2,
        copper: 0.1,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 395,
        vitaminB6: 0.2,
        vitaminC: 22.0,
        vitaminE: 0.2,
        vitaminK: 6.0,
        thiamin: 0.0,
        riboflavin: 0.1,
        niacin: 1.0,
        folate: 40
      }
    }
  },
  // Fats by tablespoon
  {
    name: 'Almond Butter',
    category: 'fat',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 98,
      macros: {
        protein: 2.4,
        fat: {
          total: 8.9,
          saturated: 0.7,
          monounsaturated: 5.9,
          polyunsaturated: 1.9
        },
        carbohydrates: {
          total: 3.4,
          fiber: 1.6,
          sugar: 0.7
        }
      },
      minerals: {
        calcium: 47,
        iron: 0.5,
        magnesium: 45,
        phosphorus: 51,
        potassium: 71,
        sodium: 38,
        zinc: 0.9,
        copper: 0.2,
        manganese: 0.3
      },
      vitamins: {
        vitaminA: 1,
        vitaminB6: 0.0,
        vitaminC: 0.0,
        vitaminE: 5.1,
        vitaminK: 0.0,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.3,
        folate: 8
      }
    }
  },
  {
    name: 'Almonds',
    category: 'protein',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 49,
      macros: {
        protein: 1.2,
        fat: {
          total: 4.3,
          saturated: 0.3,
          monounsaturated: 2.9,
          polyunsaturated: 0.9
        },
        carbohydrates: {
          total: 1.9,
          fiber: 0.9,
          sugar: 0.2
        }
      },
      minerals: {
        calcium: 19,
        iron: 0.3,
        magnesium: 27,
        phosphorus: 38,
        potassium: 62,
        sodium: 0,
        zinc: 0.5,
        copper: 0.1,
        manganese: 0.3
      },
      vitamins: {
        vitaminA: 0,
        vitaminB6: 0.0,
        vitaminC: 0.0,
        vitaminE: 3.3,
        vitaminK: 0.7,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.0,
        folate: 3
      }
    }
  },
  {
    name: 'Avocado',
    category: 'fruit',
    nutrition: {
      amount: 1,
      unit: 'whole',
      calories: 234,
      macros: {
        protein: 2.9,
        fat: {
          total: 21.4,
          saturated: 3.1,
          monounsaturated: 14.7,
          polyunsaturated: 2.7
        },
        carbohydrates: {
          total: 12.1,
          fiber: 9.8,
          sugar: 0.2
        }
      },
      minerals: {
        calcium: 12,
        iron: 0.7,
        magnesium: 40,
        phosphorus: 52,
        potassium: 975,
        sodium: 10,
        zinc: 0.4,
        copper: 0.2,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 293,
        vitaminB6: 0.4,
        vitaminC: 20.1,
        vitaminE: 4.2,
        vitaminK: 21,
        thiamin: 0.1,
        riboflavin: 0.2,
        niacin: 2.6,
        folate: 89
      }
    }
  },
  {
    name: 'Sesame Seeds',
    category: 'fat',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 52,
      macros: {
        protein: 1.6,
        fat: {
          total: 4.5,
          saturated: 0.7,
          monounsaturated: 1.3,
          polyunsaturated: 2
        },
        carbohydrates: {
          total: 2.1,
          fiber: 1.1,
          sugar: 0.1
        }
      },
      minerals: {
        calcium: 88,
        iron: 1.3,
        magnesium: 32,
        phosphorus: 57,
        potassium: 45,
        sodium: 1,
        zinc: 0.7,
        copper: 0.2,
        manganese: 0.7
      },
      vitamins: {
        vitaminA: 9,
        vitaminB6: 0.1,
        vitaminC: 0.1,
        vitaminE: 0.1,
        vitaminK: 6.7,
        thiamin: 0.1,
        riboflavin: 0.0,
        niacin: 0.4,
        folate: 5
      }
    }
  },
  {
    name: 'Brazil Nuts',
    category: 'fat',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 33,
      macros: {
        protein: 0.7,
        fat: {
          total: 3.5,
          saturated: 0.8,
          monounsaturated: 1.9,
          polyunsaturated: 0.4
        },
        carbohydrates: {
          total: 0.6,
          fiber: 0.4,
          sugar: 0.1
        }
      },
      minerals: {
        calcium: 4,
        iron: 0.3,
        magnesium: 16,
        phosphorus: 16,
        potassium: 33,
        sodium: 0,
        zinc: 0.5,
        copper: 0.1,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 1,
        vitaminB6: 0.0,
        vitaminC: 0.0,
        vitaminE: 0.1,
        vitaminK: 0.8,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.1,
        folate: 6
      }
    }
  },
  {
    name: 'Cashew Butter',
    category: 'fat',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 94,
      macros: {
        protein: 2,
        fat: {
          total: 8,
          saturated: 1.5,
          monounsaturated: 5.4,
          polyunsaturated: 0.9
        },
        carbohydrates: {
          total: 4,
          fiber: 0.5,
          sugar: 1
        }
      },
      minerals: {
        calcium: 8,
        iron: 0.7,
        magnesium: 33,
        phosphorus: 73,
        potassium: 98,
        sodium: 3,
        zinc: 1.6,
        copper: 0.6,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 1,
        vitaminB6: 0.1,
        vitaminC: 0.1,
        vitaminE: 0.4,
        vitaminK: 0.1,
        thiamin: 0.1,
        riboflavin: 0.0,
        niacin: 0.3,
        folate: 3
      }
    }
  },
  {
    name: 'Cashews',
    category: 'fat',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 49,
      macros: {
        protein: 1.0,
        fat: {
          total: 4.0,
          saturated: 0.8,
          monounsaturated: 2.2,
          polyunsaturated: 0.7
        },
        carbohydrates: {
          total: 3.0,
          fiber: 0.3,
          sugar: 0.5
        }
      },
      minerals: {
        calcium: 2,
        iron: 0.3,
        magnesium: 33,
        phosphorus: 34,
        potassium: 54,
        sodium: 1,
        zinc: 0.3,
        copper: 0.1,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 1,
        vitaminB6: 0.1,
        vitaminC: 0.1,
        vitaminE: 0.1,
        vitaminK: 0.6,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.1,
        folate: 2
      }
    }
  },
  {
    name: 'Cacao Nibs',
    category: 'fat',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 20,
      macros: {
        protein: 0.4,
        fat: {
          total: 1.8,
          saturated: 1.1,
          monounsaturated: 0.5,
          polyunsaturated: 0.1
        },
        carbohydrates: {
          total: 1,
          fiber: 0.9,
          sugar: 0
        }
      },
      minerals: {
        calcium: 3,
        iron: 0.2,
        magnesium: 9,
        phosphorus: 13,
        potassium: 27,
        sodium: 1,
        zinc: 0.1,
        copper: 0.1,
        manganese: 0.1
      },
      vitamins: {
        vitaminA: 5,
        vitaminB6: 0.0,
        vitaminC: 0,
        vitaminE: 0.1,
        vitaminK: 0.2,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.0,
        folate: 1
      }
    }
  },
  {
    name: 'Chia Seeds',
    category: 'superfood',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 58,
      macros: {
        protein: 2.5,
        fat: {
          total: 4.0,
          saturated: 0.4,
          monounsaturated: 0.3,
          polyunsaturated: 3.0
        },
        carbohydrates: {
          total: 4.0,
          fiber: 3.4,
          sugar: 0.0
        }
      },
      minerals: {
        calcium: 78,
        iron: 0.7,
        magnesium: 49,
        phosphorus: 80,
        potassium: 44,
        sodium: 1,
        zinc: 0.6,
        copper: 0.1,
        manganese: 0.4
      },
      vitamins: {
        vitaminA: 15,
        vitaminB6: 0.0,
        vitaminC: 0.1,
        vitaminE: 0.1,
        vitaminK: 3.5,
        thiamin: 0.0,
        riboflavin: 0.0,
        niacin: 0.2,
        folate: 6
      }
    }
  },
  {
    name: 'Flax Seeds',
    category: 'fat',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 37,
      macros: {
        protein: 1.3,
        fat: {
          total: 3,
          saturated: 0.3,
          monounsaturated: 0.6,
          polyunsaturated: 2.0
        },
        carbohydrates: {
          total: 2.0,
          fiber: 2.8,
          sugar: 0.2
        }
      },
      minerals: {
        calcium: 18,
        iron: 0.4,
        magnesium: 27,
        phosphorus: 44,
        potassium: 60,
        sodium: 1,
        zinc: 0.4,
        copper: 0.1,
        manganese: 0.2
      },
      vitamins: {
        vitaminA: 1,
        vitaminB6: 0.0,
        vitaminC: 0.1,
        vitaminE: 0.1,
        vitaminK: 0.1,
        thiamin: 0.1,
        riboflavin: 0.0,
        niacin: 0.1,
        folate: 2
      }
    }
  },
  {
    name: 'Hemp Seeds',
    category: 'protein',
    nutrition: {
      amount: 1,
      unit: 'tablespoon',
      calories: 57,
      macros: {
        protein: 3,
        fat: {
          total: 4,
          saturated: 0.4,
          monounsaturated: 0.6,
          polyunsaturated: 2.7
        },
        carbohydrates: {
          total: 1,
          fiber: 0.8,
          sugar: 0.1
        }
      },
      minerals: {
        calcium: 15,
        iron: 1.4,
        magnesium: 45,
        phosphorus: 105,
        potassium: 120,
        sodium: 0,
        zinc: 1,
        copper: 0.1,
        manganese: 2
      },
      vitamins: {
        vitaminA: 8,
        vitaminB6: 0.1,
        vitaminC: 0.1,
        vitaminE: 1.9,
        vitaminK: 0.5,
        thiamin: 0.1,
        riboflavin: 0.1,
        niacin: 2.8,
        folate: 4
      }
    }
  },
  

  // Protein by scoop or serving
  {
    name: 'Tofu',
    category: 'protein',
    nutrition: {
      amount: 1,
      unit: 'cup',
      calories: 86,
      macros: {
        protein: 9,
        fat: {
          total: 5.5,
          saturated: 0.8,
          monounsaturated: 1.2,
          polyunsaturated: 2.4
        },
        carbohydrates: {
          total: 2,
          fiber: 0.5,
          sugar: 0.2
        }
      },
      minerals: {
        calcium: 350,
        iron: 2.7,
        magnesium: 61,
        phosphorus: 117,
        potassium: 121,
        sodium: 4,
        zinc: 0.7,
        copper: 0.2,
        manganese: 0.6
      },
      vitamins: {
        vitaminA: 0.1,
        vitaminB6: 0.1,
        vitaminC: 0,
        vitaminE: 0.1,
        vitaminK: 0.2,
        thiamin: 0.1,
        riboflavin: 0.2,
        niacin: 0.4,
        folate: 10
      }
    }
  },
  {
    name: 'Vegan Protein Powder',
    category: 'protein',
    nutrition: {
      amount: 1,
      unit: 'scoop',
      calories: 120,
      macros: {
        protein: 20,
        fat: {
          total: 2,
          saturated: 0,
          monounsaturated: 0,
          polyunsaturated: 1
        },
        carbohydrates: {
          total: 5,
          fiber: 2,
          sugar: 0
        }
      },
      minerals: {
        calcium: 150,
        iron: 3.6,
        magnesium: 60,
        phosphorus: 200,
        potassium: 250,
        sodium: 210,
        zinc: 2.5,
        copper: 0.5,
        manganese: 1.5
      },
      vitamins: {
        vitaminA: 0,
        vitaminB6: 0.2,
        vitaminC: 0,
        vitaminE: 2.5,
        vitaminK: 0,
        thiamin: 0.1,
        riboflavin: 0.2,
        niacin: 0.6,
        folate: 10
      }
    }
  }  
];

async function seedIngredients() {
  try {
    // Connect to the database
    await mongoose.connect(db, {
      useNewUrlParser: true
    });

    // Loop through the ingredientsData array and create new ingredient documents
    await Ingredient.insertMany(ingredientsData);
    console.log('Ingredients created.');
    console.log('Seeding complete.');
    process.exit(); // Exit the process
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1); // Exit the process with an error code
  }
}

// Run the seedIngredients function to start the seeding process
seedIngredients();
