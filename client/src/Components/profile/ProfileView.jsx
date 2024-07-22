import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import NotFound from "../layout/NotFound";
import { getUserById } from "../../services/userService";
import { getUserRatings } from "../../services/ratingService";
import { getRecipesByUserId } from "../../services/recipeService";

function ProfileView() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [user, setUser] = useState(null);
	const [recipes, setRecipes] = useState([]);
	const [ratedRecipes, setRatedRecipes] = useState([]);
	const { id } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const [userRes, recipesRes, ratingsRes] = await Promise.all([
					getUserById(id),
					getRecipesByUserId(id),
					getUserRatings(id),
				]);

				setUser(userRes);
				setRecipes(recipesRes.data);
				setRatedRecipes(ratingsRes.userRatings);
			} catch (error) {
				setError("Failed to fetch data. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <NotFound message={error} />;
	}

	if (!user) {
		return null;
	}

	console.log(user);

	// Sort recipes and ratedRecipes by date in descending order
	const sortedRecipes = recipes.sort(
		(a, b) => new Date(b.createDate) - new Date(a.createDate)
	);
	const sortedRatedRecipes = ratedRecipes.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);

	return (
		<div className="account">
			<h3>{user.name}'s Recipes</h3>
			<ul className="recipe-list">
				{sortedRecipes.length > 0 ? (
					sortedRecipes.map((recipe) => (
						<li key={recipe._id}>
							<span>{new Date(recipe.createDate).toLocaleDateString()}</span>
							<a href={`/recipes/${recipe._id}`}>{recipe.name}</a>
						</li>
					))
				) : (
					<p>No recipes found</p>
				)}
			</ul>
			<h3>{user.name}'s Activity</h3>
			<ul className="recipe-list">
				{sortedRatedRecipes.length > 0 ? (
					sortedRatedRecipes.map((recipe) => (
						<li key={recipe.recipeId}>
							<span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
							<span>
								<a href={`/recipes/${recipe._id}`}>{recipe.recipeName}</a>
							</span>
							<span>
								{Array.from({ length: recipe.stars }, (_, index) => (
									<i
										key={index}
										className="fa-solid fa-star"
										style={{ fontSize: "1rem", color: "gold" }}></i>
								))}
							</span>
						</li>
					))
				) : (
					<p>{user.name} hasn't rated any recipes yet.</p>
				)}
			</ul>
		</div>
	);
}

export default ProfileView;
