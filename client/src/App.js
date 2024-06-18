import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./Components/auth/Register";
import Login from "./Components/auth/Login";
import Navbar from "./Components/layout/Navbar";
import Landing from "./Components/layout/Landing";
import Dashboard from "./Components/dashboard/Dashboard";
import Profile from "./Components/profile/Profile";
import PrivateRoute from "./Components/routing/PrivateRoute";
import Recipe from "./Components/recipe/Recipe";
import RecipeForm from "./Components/recipe-creation/RecipeForm";
import ProfileView from "./Components/profile/ProfileView";
import Comments from "./Components/recipe/Comments";

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
			<Navbar />
			<ToastContainer limit={3} />
			<Routes>
				<Route path="profiles">
					<Route
						path="/profiles"
						element={<PrivateRoute Component={Profile} />}
					/>
					<Route path=":id" element={<ProfileView />} />
				</Route>
				<Route
					path="/dashboard"
					element={<PrivateRoute Component={Dashboard} />}
				/>
				<Route path="/" element={<Landing />} />
				<Route
					path="/register"
					element={<Register showToast={showToastMessage} />}
				/>
				<Route path="/login" element={<Login showToast={showToastMessage} />} />
				<Route path="recipes">
					<Route path="/recipes/create" element={<RecipeForm />} />
					<Route path=":id" element={<Recipe />} />
					<Route path=":id/comments" element={<Comments />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
