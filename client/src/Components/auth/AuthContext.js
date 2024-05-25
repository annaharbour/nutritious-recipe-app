import React, { createContext, useState, useEffect, useContext } from "react";
import { login } from "../../services/authService";
import { register } from "../../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const token = searchParams.get("token");
		const userString = searchParams.get("user");

		if (token && userString) {
			localStorage.setItem("token", token);
			setIsLoggedIn(true);
			const user = JSON.parse(decodeURIComponent(userString));
			localStorage.setItem("user", userString);
			setUserInfo(user);
		}
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
			const user = JSON.parse(localStorage.getItem("user"));
			setUserInfo(user);
		}
	}, []);

	const loginUser = async (email, password) => {
		try {
			const res = await login(email, password);
			const { password: _, ...userWithoutPassword } = res.data.user;
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("user", JSON.stringify(userWithoutPassword));
			setUserInfo(userWithoutPassword);
			setIsLoggedIn(true);
		} catch (error) {
			throw new Error(error.response.message || "Login failed");
		}
	};

	const registerUser = async (email, password, phone, name) => {
		try {
			const res = await register(email, password, phone, name);
			const { password: _, ...userWithoutPassword } = res.data.user;
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("user", JSON.stringify(userWithoutPassword));
			setUserInfo(userWithoutPassword);
			setIsLoggedIn(true);
		} catch (error) {
			throw new Error(error.message || "Registration failed");
		}
	};

	function logoutUser() {
		try {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			setIsLoggedIn(false);
			setUserInfo(null);
		} catch (error) {
			throw new Error(error.response.data.message || "Logout failed");
		}
	}

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, userInfo, loginUser, registerUser, logoutUser }}>
			{children}
		</AuthContext.Provider>
	);
};
