import axios from "axios";
import recipeUrl from "./endpoints";

const axiosInstance = axios.create({
	baseURL: `${recipeUrl}`,
});

export function getRecipes() {
	return axiosInstance.get("/");
}

export function getRecipeById(id) {
	return axiosInstance.get(`/${id}`);
}

export function createRecipe(recipe) {
	return axiosInstance.post("/", {
		recipe,
	});
}

export function updateRecipe(recipe) {
	return axiosInstance.put("/", {
		recipe,
	});
}

export function deleteRecipe(id) {
	return axiosInstance.delete(`/${id}`);
}
