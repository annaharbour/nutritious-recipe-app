import axios from "axios";
import {usersUrl} from "./endpoints";

const axiosInstance = axios.create({
	baseURL: usersUrl,
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("token"),
	},
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
		return res.data;
	} catch (error) {
		console.error(error);
	}
};

export const getUserFavorites = async (id) => {
	try {
		const res = await axiosInstance.get(`/favorites`);
		return res.data;
	} catch (error) {
		console.error(error);
	}
}

export const deleteUser = async (id) => {
	try {
		const res = await axiosInstance.delete(`/${id}`);
		return res;
	} catch (error) {
		console.error(error);
	}
};
