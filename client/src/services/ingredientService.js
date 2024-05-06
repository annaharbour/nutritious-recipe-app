import axios from "axios";
import ingredientsUrl from "./endpoints";

const axiosInstance = axios.create({
    baseURL: `${ingredientsUrl}`,
})

export function getIngredients(){
    return axiosInstance.get('/');
}

export function getIngredientCategories(){
    return axiosInstance.get('/categories');
}

export function getIngredientsByCategory(category){
    return axiosInstance.get(`/${category}`);
}

export function getIngredientById(id){
    return axiosInstance.get(`/${id}`);
}

export function deleteIngredient(id){
    return axiosInstance.delete(`/${id}`);
}

