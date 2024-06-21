import axios from "axios";
import { recipesUrl } from "./endpoints";

const axiosInstance = axios.create({
	baseURL: `${recipesUrl}`,
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("token"),
	},
});

export const getRating = async (recipeId) => {
	try {
		const res = await axiosInstance.get(`/${recipeId}/rating`);
		return res.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const getUserRatings = async (userId) => {
	try {
		const res = await axiosInstance.get(`/${userId}/ratings`);
		return res.data;
	} catch (error) {
		console.error(error);
	}
};

export const rateRecipe = async (recipeId, stars) => {
	try {
		const res = await axiosInstance.put(`/${recipeId}/rating`, {
			stars,
		});
		return res.data;
	} catch (error) {
		console.error(error);
	}
};
