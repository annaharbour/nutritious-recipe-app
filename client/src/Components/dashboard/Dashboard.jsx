import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Dashboard = ({ showToast }) => {
	const userInfo = useAuth().userInfo;
	const { name } = userInfo;

	return (
		<div className="dash">
			{userInfo && (
				<h3>
					<Link to="/profile">
						<i className="fas fa-user"></i>
					</Link>
					Hello, {name}
				</h3>
			)}
			<div className="dash-grid">
				<Link to="/recipes/search" className="dash-item search">
					<h2>Search Recipes</h2>
				</Link>

				<Link to="/recipes/create" className="dash-item create">
					<h2>New Recipe</h2>
				</Link>

				{userInfo && (
					<Link to="/recipes" className="dash-item your-recipes">
						<h2>Your Recipes</h2>
					</Link>
				)}

				{userInfo && (
					<Link to="/recipes/favorites" className="dash-item saved">
						<h2>Saved Recipes</h2>
					</Link>
				)}

				<Link to="/" className="dash-item trending">
					<h2>Trending</h2>
				</Link>

				<Link to="/" className="dash-item account">
					<h2>Your Account</h2>
				</Link>
			</div>
		</div>
	);
};

export default Dashboard;
