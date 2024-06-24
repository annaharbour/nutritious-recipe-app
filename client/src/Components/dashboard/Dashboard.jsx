import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
	getRecipesByUserId,
	getSavedRecipesByUserId,
} from "../../services/recipeService";
import Search from "./Search";

const Dashboard = () => {
	const [loading, setLoading] = useState(false);
	const userInfo = useAuth().userInfo;
	const { name } = userInfo;
	const [favoriteRecipes, setFavoriteRecipes] = useState([]);
	const [userRecipes, setUserRecipes] = useState([]);

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				setLoading(true);
				const res = await getSavedRecipesByUserId(userInfo._id);
				setFavoriteRecipes(res.data);
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
			try {
				setLoading(true);
				const res = await getRecipesByUserId(userInfo._id);
				setUserRecipes(res.data);
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		};
		fetchRecipes();
	}, [userInfo]);

	return (
		<section className="container">
			<h1>
				<Link to="/profile">
					<i className="fas fa-user"></i>
				</Link>
				Hello, {name}
			</h1>
			<h3>Your Profile</h3>
			<Link to="/profiles">View your profile</Link>
			<h3>Search Recipes</h3>
			<Search/>
			<h3>Your recipes</h3>
			<Link to='/recipes/create'>Create a new recipe</Link>
			{loading && <p>Loading...</p>}
			{userRecipes &&
				userRecipes.length !== 0 &&
				userRecipes.map((recipe) => (
					<Link key={recipe._id} to={`/recipes/${recipe._id}`}>
						<li>{recipe.name}</li>
					</Link>
				))}
			<h3>Your favorites</h3>
			{loading && <p>Loading...</p>}
			{favoriteRecipes.length !== 0 ? (
							
				favoriteRecipes.map((recipe) => (
					<Link key={recipe._id} to={`/recipes/${recipe._id}`}>
						<li>{recipe.name}</li>
					</Link>)
				)) : (
					<p>No favorite recipes yet</p>
				)}
			
		</section>
	);
};

export default Dashboard;
