import React, { useState } from 'react';

const RecipeForm = () => {
    const [recipeName, setRecipeName] = useState('');
    const [foods, setFoods] = useState([]);

    const handleRecipeNameChange = (e) => {
        setRecipeName(e.target.value);
    };

    const handleFoodChange = (index, e) => {
        const updatedFoods = [...foods];
        updatedFoods[index] = e.target.value;
        setFoods(updatedFoods);
        calculateNutrition();
    };

    const handleAddFood = () => {
        if (foods.length < 5) {
            setFoods([...foods, '']);
        }
        calculateNutrition();
    };

    const handleRemoveFood = (index) => {
        const updatedFoods = [...foods];
        updatedFoods.splice(index, 1);
        setFoods(updatedFoods);
    };

    const calculateNutrition = () => {
        // TODO: Perform the calculation based on the added foods and display the result
    };

    const handleSaveRecipe = (e) => {
        e.preventDefault();
        // TODO: Save the recipe to the database
    }

    return (
        <div>
            <h2>Create a Recipe</h2>
            <form>
                <label htmlFor="recipeName">Recipe Name:</label>
                <input
                    type="text"
                    id="recipeName"
                    value={recipeName}
                    onChange={handleRecipeNameChange}
                />

                <h3>Foods:</h3>
                {foods.map((food, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            value={food}
                            onChange={(e) => handleFoodChange(index, e)}
                        />
                        <button type="button" onClick={() => handleRemoveFood(index)}>
                            Remove
                        </button>
                    </div>
                ))}

                <button type="button" onClick={handleAddFood}>
                    Add Food
                </button>

               <button type="submit" onClick={handleSaveRecipe}>Calculate Nutrition</button>
            </form>
        </div>
    );
};

export default RecipeForm;