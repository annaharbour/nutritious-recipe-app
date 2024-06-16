import axios from "axios";
import { recipesUrl } from "./endpoints";


const axiosInstance = axios.create({
	baseURL: recipesUrl,
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("token"),
	},
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

export const createRecipe = async (name, ingredients) => {
	const user = JSON.parse(localStorage.getItem("user"));
    try {
        const res = await axiosInstance.post("/", {
            name: name, 
            ingredients: ingredients,
			user: user._id,
        });
        return res;
    } catch (error) {
        console.error(error);
        throw error; 
    }
};


export const calculateRecipeNutrition = async (recipe) => {
	try {
		const res = await axiosInstance.post("/nutrition", 
			recipe,
		);
		return res;
	} catch (error) {
		console.error(error);
	}
}

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

export const toggleSaveRecipe = async (id) => {
	try {
		const res = await axiosInstance.put(`/save/${id}`);
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


