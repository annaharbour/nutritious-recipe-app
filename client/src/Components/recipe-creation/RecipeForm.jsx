import React, { useState, useEffect } from "react";
import { getIngredientsByCategory } from "../../services/ingredientService";
import { createRecipe } from "../../services/recipeService";

const RecipeForm = () => {
  const [recipeName, setRecipeName] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const ingredientCategories = [
    "Fruit",
    "Vegetable",
    "Protein",
    "Fat",
    "Nut and Seed Products",
    "Liquid",
  ];
  const [category, setCategory] = useState(ingredientCategories[0]);

  useEffect(() => {
    fetchIngredients(category);
  }, [category]);

  const fetchIngredients = async (category) => {
    try {
      const res = await getIngredientsByCategory(category);
      setIngredients(res.data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const handleRecipeNameChange = (e) => {
    setRecipeName(e.target.value);
  };

  const handleAddIngredient = (ingredient) => {
    if (recipeIngredients.length < 5) {
      setRecipeIngredients([...recipeIngredients, ingredient]);
    } else {
      alert("You can only add up to 5 ingredients");
    }
  };

  const handleRemoveIngredient = (ingredient) => () => {
    setRecipeIngredients(
        recipeIngredients.filter((i) => i._id !== ingredient._id)
    );
};

  const handleGoBack = (e) => {
    e.preventDefault();
    setCategory(
      ingredientCategories[
        (ingredientCategories.indexOf(category) + 1) %
          ingredientCategories.length
      ]
    );
  };

  const handleGoForward = (e) => {
    e.preventDefault();
    setCategory(
      ingredientCategories[
        (ingredientCategories.indexOf(category) -
          1 +
          ingredientCategories.length) %
          ingredientCategories.length
      ]
    );
  };

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    try {
      await createRecipe({ name: recipeName, ingredients: recipeIngredients });
      alert("Recipe saved successfully");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Error saving recipe");
    }
  };

  return (
    <div>
      <h2>Create a Recipe</h2>
      <div>
        <button onClick={handleGoForward}>Previous Category</button>
        <button onClick={handleGoBack}>Next Category</button>
      </div>
      <form>
        <label htmlFor="recipeName">Recipe Name:</label>
        <input
          type="text"
          id="recipeName"
          value={recipeName}
          onChange={handleRecipeNameChange}
        />
        <h3>{category}</h3>
        <select
          onChange={(e) =>
            handleAddIngredient(
              ingredients.find((ingredient) => ingredient.description === e.target.value)
            )
          }
        >
          <option value="">Add an ingredient</option>
          {ingredients &&
            ingredients.map((ingredient) => (
              <option key={ingredient._id} value={ingredient.description}>
                {ingredient.description}
              </option>
            ))}
        </select>
        <div>
          <h4>Selected Ingredients:</h4>
          <ul>
            {recipeIngredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.description} ({ingredient.category})
                <button onClick={handleRemoveIngredient(ingredient)}>
                    Remove
                </button>
              </li>
              
            ))}
          </ul>
        </div>
        <button type="submit" onClick={handleSaveRecipe}>
          Save Recipe
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;
