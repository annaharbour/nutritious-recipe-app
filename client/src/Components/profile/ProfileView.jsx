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

	const date = new Date().getTime();
	const createdAtDate = new Date(user.createdAt).getTime();
	const dateDiff = date - createdAtDate;
	const days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));

	return (
		<div>
			<h1>{user.name}</h1>
			{days ? <i>Joined {days} days ago</i> : <></>}
			<h2>{user.name}'s Recipes</h2>
			<ul>
				{recipes.length > 0 ? (
					recipes.map((recipe) => (
						<li key={recipe._id}>
							<a href={`/recipes/${recipe._id}`}>{recipe.name}</a>
						</li>
					))
				) : (
					<p>No recipes found</p>
				)}
			</ul>
			<h2>Rated Recipes</h2>
			<ul>
				{ratedRecipes.length > 0 ? (
					ratedRecipes.map((recipe) => (
						<li key={recipe.recipeId}>
							{user.name} gave{" "}
							<a href={`/recipes/${recipe._id}`}>{recipe.recipeName}</a>{" "}
							{recipe.stars} stars on{" "}
							{new Date(recipe.createdAt).toLocaleDateString()}
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
