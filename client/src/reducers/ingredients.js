import { FETCH_CATEGORIES_SUCCESS, FETCH_INGREDIENTS_SUCCESS } from "../actions/types";

// Define initial state
const initialState = {
  categories: {
    fruit: [],
    vegetable: [],
    protein: [],
    fat: [],
    superfood: [],
    liquid: [],
  },
  ingredients: [], // Your ingredients data
};

// Reducer handling the categories and ingredients
function ingredientsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: {
          ...state.categories,
          ...payload, // Update the categories object with the fetched categories
        }
      };
    case FETCH_INGREDIENTS_SUCCESS:
      // Update the specific category with fetched ingredients
      return {
        ...state,
        categories: {
          ...state.categories,
          [payload.category]: payload.ingredients,
        },
      };

    default:
      return state;
  }
}

export default ingredientsReducer;

