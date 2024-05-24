const Nutrient = require("../models/NutrientModel");
const Ingredient = require("../models/IngredientModel");

const getAllNutrients = async (req, res) => {
    try {
        const nutrients = await Nutrient.find();
        return res.json(nutrients);
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

const getNutrientById = async (req, res) => {
    const nutrientId = req.params.id;
    try {
        const nutrient = await Nutrient.findById(nutrientId);
        if (!nutrient) {
            return res.status(404).json({ message: "Nutrient not found" });
        }

        return res.json(nutrient);
    } catch (err) {
        return res.status(500).json({ message: "Server Error" });
    }
};

const getIngredientsByNutrient = async (req, res) => {
    const nutrientId = req.params.nutrientId;
    try {
        const ingredients = await Ingredient.find({ "foodNutrients.nutrient": nutrientId }).populate(
            "foodNutrients.nutrient"
        ).sort({ "foodNutrients.value": -1 });
        return res.json(ingredients);
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    getAllNutrients,
    getNutrientById,
    getIngredientsByNutrient
};