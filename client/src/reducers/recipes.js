import { GET_RECIPE, RECIPE_ERROR, RECIPE_DELETED, UPDATE_RECIPE, GET_RECIPES } from "../actions/types";

const initialState = {
    recipe: null,
    recipes: [],
    loading: true,
    error: {}
}

function recipeReducer(state=initialState, action) {
    const { type, payload } = action;

    switch(type){
        case GET_RECIPE:
        case UPDATE_RECIPE:
            return {
                ...state,
                recipe: payload?.recipe,
                loading: false
            };
        case GET_RECIPES:
            return {
                ...state,
                recipes: payload,
                loading: false
            };
        case RECIPE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                recipe: null
            };
        case RECIPE_DELETED:
            return {
                ...state,
                recipe: null,
            };
        default:
            return state;
    }
}

export default recipeReducer;