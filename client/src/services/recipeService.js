import axios from "axios";
import { recipesUrl } from "./endpoints";

const axiosInstance = axios.create({
	baseURL: recipesUrl,
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("token"),
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["x-auth-token"] = token;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const getRecipes = async () => {
	try {
		const res = await axiosInstance.get("/");
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const getRecipeById = async (id) => {
	try {
		const res = await axiosInstance.get(`/${id}`);
		return res.data;
	} catch (error) {
		throw new Error(error);
	}
};

export const createRecipe = async (name, ingredients, servings) => {
	try {
		const res = await axiosInstance.post("/", {
			name: name,
			ingredients: ingredients,
			servings: servings,
		});
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const calculateRecipeNutrition = async ({ ingredients, servings }) => {
	try {
		const res = await axiosInstance.post("/nutrition", {
			ingredients: ingredients,
			servings: servings,
		});
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const getRecipeByCategory = async (category) => {
	try {
		const res = await axiosInstance.get(`/category/${category}`);
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const getRecipesByUserId = async (userId) => {
	try {
		const res = await axiosInstance.get(`/user/${userId}`);
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const getSavedRecipesByUserId = async (userId) => {
	try {
		const res = await axiosInstance.get(`/user/${userId}/saved`);
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const toggleSaveRecipe = async (id) => {
	try {
		const res = await axiosInstance.put(`/save/${id}`);
		return res.data;
	} catch (error) {
		throw new Error(error);
	}
};

export const deleteRecipe = async (id) => {
	try {
		const res = await axiosInstance.delete(`/${id}`);
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const searchRecipes = async (query) => {
	try {
		// Construct the query string from the query object
		const queryString = new URLSearchParams(query).toString();
		const res = await axiosInstance.get(`/search?${queryString}`);
		return res.data;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error);
		} else {
			throw new Error(error.message || "An error occurred");
		}
	}
};
