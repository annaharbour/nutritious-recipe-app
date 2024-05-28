import axios from "axios";
import { recipesUrl } from "./endpoints";

const axiosInstance = axios.create({
	baseURL: recipesUrl,
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
		return res.data;
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

export const getRecipeByCategory = async (category) => {
	try {
		const res = await axiosInstance.get(`/category/${category}`);
		return res;
	} catch (error) {
		console.error(error);
	}
}

export const getRecipesByUserId = async (userId) => {
	try {
		const res = await axiosInstance.get(`/user/${userId}`);
		return res;
	} catch (error) {
		console.error(error);
	}
}

export const getSavedRecipesByUserId = async (userId) => {
	try {
		const res = await axiosInstance.get(`/user/${userId}/saved`);
		return res;
	} catch (error) {
		console.error(error);
	}
}

export const toggleSaveRecipe = async (recipeId) => {
	try {
		const res = await axiosInstance.put(`/save/${recipeId}`);
		return res;
	} catch (error) {
		console.error(error);
	}
}

export const rateRecipe = async (recipeId, rating) => {
	try {
		const res = await axiosInstance.put(`/${recipeId}/rate`, {
			rating,
		});
		return res;
	} catch (error) {
		console.error(error);
	}
}

export const deleteRecipe = async (id) => {
	try {
		const res = await axiosInstance.delete(`/${id}`);
		return res;
	} catch (error) {
		console.error(error);
	}
};


