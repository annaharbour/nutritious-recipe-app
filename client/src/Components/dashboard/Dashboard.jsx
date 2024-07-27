import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const userInfo = useAuth().userInfo;
	const navigate = useNavigate();

	return userInfo ? (
		<div className="dash-grid">
			<Link to="/recipes/search" className="dash-item search">
				<h2>
					<i className="fa-solid fa-search"></i> Search Recipes
				</h2>
			</Link>

			<Link to="/recipes/create" className="dash-item create">
				<h2>
					<i className="fa-solid fa-plus"></i> New Recipe
				</h2>
			</Link>

			{userInfo && (
				<Link to="/recipes" className="dash-item your-recipes">
					<h2>
						<i className="fa-solid fa-book"></i> Your Recipes
					</h2>
				</Link>
			)}

			{userInfo && (
				<Link to="/recipes/favorites" className="dash-item saved">
					<h2>
						<i className="fa-solid fa-bookmark"></i> Saved Recipes
					</h2>
				</Link>
			)}

			<Link to="/recipes/trending" className="dash-item trending">
				<h2>
					<i className="fa-solid fa-chart-line"></i>
					Trending
				</h2>
			</Link>
			{userInfo && (
				<Link to="/account" className="dash-item account-details">
					<h2>
						<i className="fa-solid fa-user"></i> Your Account
					</h2>
				</Link>
			)}
		</div>
	) : (
		navigate("/")
	);
};

export default Dashboard;
