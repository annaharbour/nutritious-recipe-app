// import React, { createContext, useState, useEffect, useContext } from "react";
// import { login } from "../../services/authService";
// import { register } from "../../services/authService";
// import ReactGA from "react-ga4";

// const AuthContext = createContext();

// export const useAuth = () => {
// 	return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
// 	const [userInfo, setUserInfo] = useState(null);
// 	const [isLoggedIn, setIsLoggedIn] = useState(false);

// 	useEffect(() => {
// 		const searchParams = new URLSearchParams(window.location.search);
// 		const token = searchParams.get("token");
// 		const userString = searchParams.get("user");
// 		if (token && userString) {
// 			localStorage.setItem("token", token);
// 			setIsLoggedIn(true);
// 			const user = JSON.parse(decodeURIComponent(userString));
// 			localStorage.setItem("user", userString);
// 			logAuth(user._id);

// 			setUserInfo(user);
// 		}
// 	}, []);

// 	const logAuth = (user) => {
// 		console.log("Logging Google Authentication event for user:", user);
// 		ReactGA.event({
// 			category: "User Interaction",
// 			action: "Google Authentication",
// 			label: user
// 		});
// 	};

// 	useEffect(() => {
// 		const token = localStorage.getItem("token");
// 		if (token) {
// 			setIsLoggedIn(true);
// 			const user = JSON.parse(localStorage.getItem("user"));
// 			setUserInfo(user);
// 			logAuth(user._id);
// 		}
// 	}, []);

// 	const loginUser = async (email, password) => {
// 		try {
// 			const res = await login(email, password);
// 			const { password: _, ...userWithoutPassword } = res.data.user;
// 			localStorage.setItem("token", res.data.token);
// 			localStorage.setItem("user", JSON.stringify(userWithoutPassword));
// 			setUserInfo(userWithoutPassword);
// 			setIsLoggedIn(true);
// 		} catch (error) {
// 			throw new Error(error.message || "Login failed");
// 		}
// 	};

// 	const registerUser = async (name, email, phone, password) => {
// 		try {
// 			const res = await register(name, email, phone, password);
// 			const { password: _, ...userWithoutPassword } = res.data.user;
// 			localStorage.setItem("token", res.data.token);
// 			localStorage.setItem("user", JSON.stringify(userWithoutPassword));
// 			setUserInfo(userWithoutPassword);
// 			setIsLoggedIn(true);
// 		} catch (error) {
// 			throw new Error(error.message || "Registration failed");
// 		}
// 	};

// 	function logoutUser() {
// 		try {
// 			localStorage.removeItem("token");
// 			localStorage.removeItem("user");
// 			setIsLoggedIn(false);
// 			setUserInfo(null);
// 		} catch (error) {
// 			throw new Error(error.response.data.message || "Logout failed");
// 		}
// 	}

// 	return (
// 		<AuthContext.Provider
// 			value={{ isLoggedIn, userInfo, loginUser, registerUser, logoutUser }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// };
import React, { createContext, useState, useEffect, useContext } from "react";
import { login } from "../../services/authService";
import { register } from "../../services/authService";
import ReactGA from "react-ga4";

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

      if (!localStorage.getItem("authEventLogged")) {
        logAuth(user._id);
        localStorage.setItem("authEventLogged", "true");
      }

      setUserInfo(user);
    }
  }, []);

  const logAuth = (userId) => {
    ReactGA.event({
      category: "User Interaction",
      action: "User Logged In",
      label: userId,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(localStorage.getItem("user"));
      setUserInfo(user);

      if (!localStorage.getItem("authEventLogged")) {
        logAuth(user._id);
        localStorage.setItem("authEventLogged", "true");
      }
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
	  logAuth(userWithoutPassword._id);
	  localStorage.setItem("authEventLogged", "true");
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  };

  const registerUser = async (name, email, phone, password) => {
    try {
      const res = await register(name, email, phone, password);
      const { password: _, ...userWithoutPassword } = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setUserInfo(userWithoutPassword);
      setIsLoggedIn(true);
	  logAuth(userWithoutPassword._id);
	  localStorage.setItem("authEventLogged", "true");
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  };

  function logoutUser() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authEventLogged"); 
      setIsLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      throw new Error(error.response.data.message || "Logout failed");
    }
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userInfo, loginUser, registerUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
