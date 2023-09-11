import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchIngredientCategories, fetchIngredientsByCategory } from '../../actions/ingredients';

const RecipeForm = ({
  categories,
  fetchIngredientCategories,
  fetchIngredientsByCategory,
}) => {
  useEffect(() => {
    // Fetch ingredient categories when the component mounts
    fetchIngredientCategories();

    // Fetch ingredients for all categories when the component mounts
    const fetchAllIngredients = async () => {
      try {
        // Create an array of promises for fetching ingredients for each category
        const ingredientPromises = Object.keys(categories)
          .filter((categoryName) => !['0', '1', '2', '3', '4'].includes(categoryName))
          .map(async (category) => {
            const response = await fetchIngredientsByCategory(category);
            return {
              category,
              ingredients: response.data,
            };
          });

        // Wait for all promises to resolve
        const allIngredients = await Promise.all(ingredientPromises);

        // Now you have all ingredients, and you can handle them as needed
        console.log('All ingredients:', allIngredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchAllIngredients();
  }, [fetchIngredientCategories, fetchIngredientsByCategory, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div>
      <h2>Create a Recipe</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(categories)
          .filter((categoryName) => !['0', '1', '2', '3', '4'].includes(categoryName))
          .map((categoryName) => (
            <div key={categoryName}>
              <h3>{categoryName}</h3>
              <select name={categoryName}>
                <option value="">Select an ingredient</option>
                {Array.isArray(categories[categoryName]) &&
                  categories[categoryName].map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  categories: state.ingredients.categories,
});

export default connect(mapStateToProps, {
  fetchIngredientCategories,
  fetchIngredientsByCategory,
})(RecipeForm);
