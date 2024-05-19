import axios from "axios";
import ingredientsUrl from "./endpoints";

const axiosInstance = axios.create({
	baseURL: `${ingredientsUrl}`,
});

export const getIngredients = async () => {
	try {
		const res = await axiosInstance.get("/");
		return res;
	} catch (error) {
		console.error(error);
	}
};

export const getIngredientsByCategory = async (category) => {
	try {
		const res = await axiosInstance.get(`/${category}`);
		return res;
	} catch (error) {
		console.error(error);
	}
};

export const getIngredientById = async (id) => {
	try {
		const res = await axiosInstance.get(`/${id}`);
		return res;
	} catch (error) {}
};
