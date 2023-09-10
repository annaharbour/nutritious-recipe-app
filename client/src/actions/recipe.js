import axios from "axios";
import { setAlert } from "./alert";

import {
    GET_RECIPE,
    GET_RECIPES,
    RECIPE_DELETED,
    RECIPE_ERROR
} from './types';


//Get all recipes
export const getRecipes = () => async dispatch => {
  try {
      const res = await axios.get('/recipes/all');

      dispatch({
          type: GET_RECIPES,
          payload: res.data

      });
  } catch(err){
      dispatch({
          type: RECIPE_ERROR,
          payload: {
              msg: err.response.statusText,
              status: err.response.status
          }
      });
  }
};

//Get recipe by id
export const getProfileById = (recipeId) => async dispatch => {
  try {
      const res = await axios.get(`/recipes/${recipeId}`);

      dispatch({
          type: GET_RECIPE,
          payload: res.data

      });
  } catch(err){
      dispatch({
          type: RECIPE_ERROR,
          payload: {
              msg: err.response.statusText,
              status: err.response.status
          }
      });
  }
};

//Create or update a recipe
export const createRecipe = (formData, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/recipes', formData, config);
        dispatch({
            type: GET_RECIPE,
            payload: res.data
        });
        dispatch(
            setAlert(edit ? 'Recipe Updated' : 'Recipe Created', 'success')
        );

    } catch (err) {
        const errors = err.response.data.errors;

        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });
        }
        dispatch({
            type: RECIPE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}


  //Delete recipe
export const deleteRecipe = (recipeId) => async dispatch => {
    if(window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        const res = await axios.delete(`/recipes/${recipeId}`);

        dispatch({
          type: GET_RECIPE,
          payload: res.data
        });
        dispatch({
            type: RECIPE_DELETED
        });

        dispatch(setAlert('Recipe permanently deleted', 'success'));
        //Get remove index

      } catch(err){
         dispatch({
            type: RECIPE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
         });
      }
    }
  };