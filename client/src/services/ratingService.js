import axios from "axios";
import { recipesUrl } from "./endpoints";

const axiosInstance = axios.create({
	baseURL: `${recipesUrl}`,
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
