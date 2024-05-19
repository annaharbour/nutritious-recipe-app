import axios from "axios";
import userUrl from "./endpoints";

const axiosInstance = axios.create({
	baseURL: `${userUrl}`,
});

export const getAllUsers = async () => {
	try {
		const res = await axiosInstance.get("/");
		return res;
	} catch (error) {
		console.error(error);
	}
};

export const getUserById = async (id) => {
	try {
		const res = await axiosInstance.get(`/${id}`);
		return res;
	} catch (error) {
		console.error(error);
	}
};

export const deleteUser = async (id) => {
	try {
		const res = await axiosInstance.delete(`/${id}`);
		return res;
	} catch (error) {
		console.error(error);
	}
};
