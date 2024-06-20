import axios from "axios";
import { commentsUrl } from "./endpoints";

const axiosInstance = axios.create({
	baseURL: commentsUrl,
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.getItem("token"),
	},
});

export const getCommentsByRecipeId = async (recipeId) => {
	try {
		const res = await axiosInstance.get(`/${recipeId}`);
		return res.data;
	} catch (error) {
		if (error.response && error.response.status === 404) {
			throw new Error("Recipe not found");
		}
		throw error;
	}
};

export const createComment = async (recipeId, text) => {
	try {
		const res = await axiosInstance.post(`/${recipeId}`, { text });
		return res;
	} catch (error) {
		if (error.response && error.response.status === 404) {
			throw new Error("Error creating comment");
		}
		throw error;
	}
};

export const getCommentById = async (commentId) => {
	try {
		const res = await axiosInstance.get(`/comment/${commentId}`);
		return res.data;
	} catch (error) {
		if (error.response && error.response.status === 404) {
			throw new Error("Recipe not found");
		}
		throw error;
	}
};

export const deleteCommentById = async (commentId) => {
	try {
		const res = await axiosInstance.delete(`/comment/${commentId}`);
		return res.data;
	} catch (error) {
		if (error.response && error.response.status === 404) {
			throw new Error("Recipe not found");
		}
		throw error;
	}
};

export const toggleLikeComment = async (commentId) => {
	try {
		const res = await axiosInstance.put(`/comment/${commentId}`);
		return res.data.likes;
	} catch (error) {
		if (error.response && error.response.status === 404) {
			throw new Error("Recipe not found");
		}
		throw error;
	}
};

export const respondToComment = async (commentId, text) => {
	try {
		const res = await axiosInstance.post(`/comment/${commentId}`, { text });
		return res.data;
	} catch (error) {
		console.error(error);
	}
};

export const getResponse = async (responseId) => {
	try {
		const res = await axiosInstance.get(`/response/${responseId}`);
		return res.data;
	} catch (error) {
		console.error(error);
	}
};

export const deleteResponse = async (responseId) => {
	try {
		const res = await axiosInstance.delete(`/response/${responseId}`);
		return res.data;
	} catch (error) {
		console.error(error);
	}
};
