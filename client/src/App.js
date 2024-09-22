import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactGA from "react-ga4"; // Google Analytics
import Navbar from "./Components/layout/Navbar";
import Landing from "./Components/layout/Landing";
import Dashboard from "./Components/dashboard/Dashboard";
import Profile from "./Components/profile/Profile";
import PrivateRoute from "./Components/routing/PrivateRoute";
import Recipe from "./Components/recipe/Recipe";
import Search from "./Components/dashboard/Search";
import RecipeForm from "./Components/recipe-creation/RecipeForm";
import ProfileView from "./Components/profile/ProfileView";
import Reset from "./Components/auth/Reset";
import UserRecipes from "./Components/dashboard/UserRecipes";
import FavoriteRecipes from "./Components/dashboard/FavoriteRecipes";
import Trending from "./Components/dashboard/Trending";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

ReactGA.initialize("G-CCHRWFNRHC");

const PageTracker = () => {
	const location = useLocation();

	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: location.pathname });
	}, [location]);

	return null;
};

const App = () => {
	const showToastMessage = (msg, type) => {
		switch (type) {
			case "success":
				toast.success(msg, {
					className: "var(--success-color)",
				});
				break;
			case "error":
				toast.error(msg, {
					className: "var(--danger-color)",
				});
				break;
			case "warn":
				toast.warn(msg, {
					className: "var(--light-color)",
				});
				break;
			case "info":
				toast.info(msg, {
					className: "var(--success-color)",
				});
				break;
			default:
				toast(msg, {
					autoClose: 10000,
					className: "var(--default-color)",
				});
				break;
		}
	};

	return (
		<Router>
			<PageTracker />
			<Navbar />
			<ToastContainer limit={1} />
			<Routes>
				<Route
					path="account"
					element={
						<PrivateRoute showToast={showToastMessage} Component={Profile} />
					}
				/>
				<Route path="profiles">
					<Route path=":id" element={<ProfileView />} />
				</Route>
				<Route
					path="/dashboard"
					element={<PrivateRoute Component={Dashboard} />}
				/>
				<Route path="/" element={<Landing showToast={showToastMessage} />} />
				<Route
					path="/reset/:token"
					element={<Reset showToast={showToastMessage} />}
				/>
				<Route path="recipes">
					<Route
						path=""
						element={<UserRecipes showToast={showToastMessage} />}
					/>
					<Route
						path="/recipes/favorites"
						element={
							<PrivateRoute
								showToast={showToastMessage}
								Component={FavoriteRecipes}
							/>
						}
					/>
					<Route
						path="/recipes/trending"
						element={<Trending showToast={showToastMessage} />}
					/>
					<Route
						path="/recipes/create"
						element={
							<PrivateRoute
								showToast={showToastMessage}
								Component={RecipeForm}
							/>
						}
					/>
					<Route path=":id" element={<Recipe showToast={showToastMessage} />} />
					<Route
						path="search"
						element={<Search showToast={showToastMessage} />}
					/>
				</Route>
				<Route path="*" element={<Landing />} />
			</Routes>
		</Router>
	);
};

export default App;
