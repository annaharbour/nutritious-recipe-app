import axios from "axios";
import recipeUrl from "./endpoints";

const axiosInstance = axios.create({
	baseURL: `${recipeUrl}`,
});

export const getRecipes = async () => {
	try {
		const res = await axiosInstance.get("/");
		return res;
	} catch (error) {
		console.error(error);
	}
};

export const getRecipeById = async (id) => {
	try {
		const res = await axiosInstance.get(`/${id}`);
		return res;
	} catch (error) {
		console.error(error);
	}
};

export const createRecipe = async (recipe) => {
	try {
		const res = await axiosInstance.post("/", {
			recipe,
		});
		return res;
	} catch (error) {
		console.error(error);
	}
};

export const updateRecipe = async (updatedRecipe) => {
	try {
		const res = await axiosInstance.put("/", {
			updatedRecipe,
		});
		return res;
	} catch (error) {
		console.error(error);
	}
};

export const deleteRecipe = async (id) => {
	try {
		const res = await axiosInstance.delete(`/${id}`);
		return res;
	} catch (error) {
		console.error(error);
	}
};
