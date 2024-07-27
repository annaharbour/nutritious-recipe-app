import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
	const { isLoggedIn, logoutUser } = useAuth();
	const navigate = useNavigate();
	const logout = async () => {
		try {
			await logoutUser();
			navigate("/");
		} catch (err) {
			console.log("Error logging out:", err);
		}
	};

	const authLinks = (
		<ul>
			<li>
				<Link to="/dashboard">
					<i className="fa-solid fa-blender"></i>Dashboard
				</Link>
			</li>
			<li onClick={logout}>
				<i className="fas fa-user" />
				<Link to="/">Logout</Link>
			</li>
		</ul>
	);

	const guestLinks = (
		<ul>
			<li>
				<Link to="/">
					<i className="fas fa-user" />
					Sign Up
				</Link>
			</li>
			<li>
				<Link to="/recipes/search">
					<i className="fa-solid fa-search"></i>Recipes
				</Link>
			</li>
			<li>
				<Link to="/recipes/trending">
					<i className="fa-solid fa-blender"></i>Trending
				</Link>
			</li>
		</ul>
	);

	return isLoggedIn ? <nav>{authLinks}</nav> : <nav>{guestLinks}</nav>;
};

export default Navbar;
