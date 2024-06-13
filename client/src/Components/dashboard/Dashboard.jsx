import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getUserFavorites } from "../../services/userService";
import { getRecipesByUserId, getSavedRecipesByUserId } from "../../services/recipeService";
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
			<h3>Your recipes</h3>
			{loading && <p>Loading...</p>}
			{userRecipes && userRecipes.map((recipe) => <li key={recipe._id}>{recipe.name}</li>)}
			<h3>Your favorites</h3>
			{loading && <p>Loading...</p>}
			{favoriteRecipes && favoriteRecipes.map((recipe) => <li key={recipe._id}>{recipe.name}</li>)} 
		</section>
	);
};

export default Dashboard;
