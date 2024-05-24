require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Ingredient = require("../models/IngredientModel");
const Nutrient = require("../models/NutrientModel");
const jsonFilePath = path.join(__dirname, "./ingredients.json");

mongoose.connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", async () => {
    console.log("Connected to the database");

    try {
        const rawData = fs.readFileSync(jsonFilePath);
        const ingredients = JSON.parse(rawData);

        const nutrientMap = new Map();

        // Step 1: Extract and save unique nutrients
        for (const ingredient of ingredients) {
            for (const nutrient of ingredient.foodNutrients) {
                if (!nutrientMap.has(nutrient.name)) {
                    const nutrientDoc = new Nutrient({
                        _id: new mongoose.Types.ObjectId(),  // Assign a new ObjectId
                        name: nutrient.name,
                        unit: nutrient.unitName,
                    });

                    await nutrientDoc.save();
                    nutrientMap.set(nutrient.name, nutrientDoc._id);
                }
            }
        }

        // Step 2: Save ingredients with references to nutrients
        for (const ingredient of ingredients) {
            const ingredientId = new mongoose.Types.ObjectId(ingredient._id.$oid || ingredient._id);

            const foodNutrients = ingredient.foodNutrients.map(nutrient => ({
                nutrient: nutrientMap.get(nutrient.name),
                value: nutrient.amount,
            }));

            const ingredientDoc = new Ingredient({
                _id: ingredientId,
                category: ingredient.category,
                foodClass: ingredient.foodClass,
                description: ingredient.description,
                foodNutrients,
                foodPortions: ingredient.foodPortions,
            });

            await ingredientDoc.save();
        }

        console.log("Database seeding completed");
    } catch (error) {
        console.error("Error during database seeding:", error);
    } finally {
        mongoose.connection.close();
    }
});
