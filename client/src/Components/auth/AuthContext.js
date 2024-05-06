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
			setIsLoggedIn(true);
			localStorage.setItem("token", res.data.token);
			const { password: _, ...userWithoutPassword } = res.data.user;
			setUserInfo(userWithoutPassword);
			localStorage.setItem("user", JSON.stringify(userWithoutPassword));
		} catch (error) {
			console.error(error);
		}
	};

	const registerUser = async (email, password, phone, name) => {
		try {
			const res = await register(email, password, phone, name);
			setIsLoggedIn(true);
			localStorage.setItem("token", res.data.token);
			setUserInfo(res.data.user);
		} catch (error) {
			console.error(error);
		}
	};

	function logoutUser() {
		try {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			setIsLoggedIn(false);
			setUserInfo(null);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, userInfo, loginUser, registerUser, logoutUser }}>
			{children}
		</AuthContext.Provider>
	);
};
