import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Components/auth/Register";
import Login from "./Components/auth/Login";
import Navbar from "./Components/layout/Navbar";
import Landing from "./Components/layout/Landing";
import Dashboard from "./Components/dashboard/Dashboard";
import Profile from "./Components/profile/Profile";
import PrivateRoute from "./Components/routing/PrivateRoute";

const App = () => {
	return (
		<Router>
			<Navbar />
			<Routes>
				 <Route
					path="/profile"
					element={<PrivateRoute Component={Profile} />}
				/>
					<Route
					path="/dashboard"
					element={<PrivateRoute Component={Dashboard} />}
				/> 
				<Route path="/" element={<Landing/>} />
				<Route path="/register" element={<Register/>} />
				<Route path="/login" element={<Login/>} />
			</Routes>
		</Router>
	);
};

export default App;
