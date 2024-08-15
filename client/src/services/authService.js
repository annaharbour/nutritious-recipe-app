import axios from "axios";
import { authURL } from "./endpoints";

const axiosInstance = axios.create({
	baseURL: `${authURL}`,
});

export const login = async (email, password) => {
	try {
		const res = await axiosInstance.post("/login", {
			email,
			password,
		});
		localStorage.setItem("token", res.data.token);
		setAuthToken(res.data.token);
		return res;
	} catch (error) {
		throw new Error(
			"Please validate the email and password associated with your account."
		);
	}
};

export const register = async (name, email, phone, password) => {
	try {
		const res = await axiosInstance.post("/register", {
			name,
			email,
			phone,
			password,
		});
		localStorage.setItem("token", res.data.token);
		setAuthToken(res.data.token);
		return res;
	} catch (error) {
		throw new Error(
			error.response.data.message || "Registration failed. Please try again."
		);
	}
};

export function setAuthToken(token) {
	if (token) {
		axios.defaults.headers.common["x-auth-token"] = token;
	} else {
		delete axios.defaults.headers.common["x-auth-token"];
	}
}

export const sendPasswordResetEmail = async (email) => {
	try {
		const res = await axiosInstance.post("/lostpassword", {
			email,
		});
		return res;
	} catch (error) {
		throw new Error("Failed to send password reset email. Please try again.");
	}
};

export const resetPassword = async (resetToken, password) => {
	try {
		const res = await axiosInstance.post(`/reset/${resetToken}`, {
			password,
		});
		localStorage.removeItem("resetToken");
		localStorage.removeItem("user");
		return res;
	} catch (error) {
		throw new Error("Failed to reset password. Please try again.");
	}
};
