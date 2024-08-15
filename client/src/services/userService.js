import axios from "axios";
import { usersUrl } from "./endpoints";

const axiosInstance = axios.create({
	baseURL: usersUrl,
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

export const updateUser = async (name, email, phone, password, newPassword) => {
	try {
		const res = await axiosInstance.put("/user", {
			name,
			email,
			phone,
			password,
			newPassword,
		});
		return res;
	} catch (error) {
		throw new Error(
			error.response.data.message || "Update failed. Please try again."
		);
	}
};

export const getUser = async () => {
	try {
		const res = await axiosInstance.get(`/user`);
		return res.data;
	} catch (error) {
		console.error(error);
		throw new Error(error.response.data.message || "No user found");
	}
};

export const getUserFavorites = async () => {
	try {
		const res = await axiosInstance.get(`/favorites`);
		return res.data;
	} catch (error) {
		console.error(error);
		throw new Error(error.response.data.message || "No favorites found");
	}
};

export const deleteUser = async (id) => {
	try {
		const res = await axiosInstance.delete(`/${id}`);
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		return res;
	} catch (error) {
		console.error(error);
		throw new Error(
			error.response.data.message ||
				"Failed to delete account. Please try again."
		);
	}
};
