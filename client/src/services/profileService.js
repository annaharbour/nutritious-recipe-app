import axios from "axios";
import { profileUrl } from "./endpoints";

const axiosInstance = axios.create({
	baseURL: `${profileUrl}`,
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("token"),
	},
});

export const getProfileById = async (userId) => {
	try {
		const res = await axiosInstance.get(`/${userId}`);
		return res.data;
	} catch (error) {
		console.error(error);
	}
};

export const createProfile = async (userId, bio) => {
	try {
		const res = await axiosInstance.post(`/${userId}`, {
			bio,
		});
		return res;
	} catch (error) {
		console.error(error);
	}
};

export const updateProfile = async (userId, bio) => {
	try {
		const res = await axiosInstance.put(`/${userId}`, {
			bio,
		});
		return res;
	} catch (error) {
		console.error(error);
	}
};
