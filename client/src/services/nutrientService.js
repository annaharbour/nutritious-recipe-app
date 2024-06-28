import axios from "axios";
import { nutrientsUrl } from "./endpoints";

const axiosInstance = axios.create({
	baseURL: nutrientsUrl,
});

export const getNutrients = async () => {
	try {
		const res = await axiosInstance.get("/");
		return res;
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const getNutrientById = async (id) => {
	try {
		const res = await axiosInstance.get(`/${id}`);
		return res;
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const getIngredientsByNutrient = async (nutrientId) => {
	try {
		const res = await axiosInstance.get(`/${nutrientId}/ingredients`);
		return res;
	} catch (error) {
		console.error(error);
		return error;
	}
};
