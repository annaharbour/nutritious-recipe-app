import axios from 'axios';

// Define action types
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_INGREDIENTS_SUCCESS = 'FETCH_INGREDIENTS_SUCCESS';

// Action to fetch ingredient categories
export const fetchIngredientCategories = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/ingredients/categories`);
      const categories = response.data;
      console.log('Fetched ingredient categories:', categories);
      // Dispatch an action to store the categories in your Redux store
      dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: categories }); // Use the defined action type
    } catch (error) {
      console.error('Error fetching ingredient categories:', error);
      // Dispatch an action to handle errors if needed
      // dispatch({ type: 'FETCH_CATEGORIES_FAILURE', error });
    }
  };
};

// Action to fetch ingredients by category
export const fetchIngredientsByCategory = (category) => {
  return async (dispatch) => {
    try {
      console.log(`fetchIngredientsByCategory action dispatched for category ${category}`);
      const response = await axios.get(`/ingredients/${category}`);
      const ingredients = response.data;
      console.log(`Fetched ingredients for category ${category}:`, ingredients); // Log the fetched ingredients
      // Dispatch an action to store the ingredients in your Redux store
      dispatch({ type: FETCH_INGREDIENTS_SUCCESS, payload: { category, ingredients } }); // Use the defined action type
    } catch (error) {
      console.error(`Error fetching ingredients for category ${category}:`, error);
      // Dispatch an action to handle errors if needed
      // dispatch({ type: 'FETCH_INGREDIENTS_FAILURE', error });
    }
  };
};
