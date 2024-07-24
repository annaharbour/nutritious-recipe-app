import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

	// Sort recipes and ratedRecipes by date in descending order
	const sortedRecipes = recipes.sort(
		(a, b) => new Date(b.createDate) - new Date(a.createDate)
	);

	console.log(sortedRecipes);

	const sortedCombinedRecipes = ratedRecipes
		.concat(recipes)
		.sort(
			(a, b) =>
				new Date(b.createdAt || b.createDate) -
				new Date(a.createdAt || a.createDate)
		);

	return (
		<div className="recipes">
			<div className="header">
				<div className="img" />
				<h1>{user.name}</h1>
			</div>

			<div className="subheader user-recipes">
				<h3>{user.name}'s Recipes</h3>
			</div>

			<ul className="recipe-list">
				{sortedRecipes.map((recipe) => (
					<li>
						<Link key={recipe._id} to={`/recipes/${recipe._id}`}>
							<h4>{recipe.name}</h4>
						</Link>
						<span className="recipe labels">
							{recipe.labels.map((label) => (
								<span
									className={`label ${label
										.toLowerCase()
										.replace(/\s+/g, "-")}`}>
									{label}
								</span>
							))}
						</span>
						<span>Serves {recipe.servings}</span>
					</li>
				))}
			</ul>
			<div className="subheader activity">
				<h3>{user.name}'s Activity</h3>
			</div>
			<ul className="recipes">
				{sortedCombinedRecipes.length > 0 ? (
					sortedCombinedRecipes.map((recipe) => (
						<li key={recipe.recipeId}>
							<span className="date">
								{recipe.createdAt
									? `Rated a recipe on ${new Date(
											recipe.createdAt
									  ).toLocaleDateString()} `
									: `Created a new recipe on ${new Date(
											recipe.createDate
									  ).toLocaleDateString()} `}
							</span>
							{recipe.createdAt ? (
								<div className="rating">
								<span>
									Gave{" "}
									<a href={`/recipes/${recipe._id}`}>{recipe.recipeName}</a>{" "}a rating:{" "}
									</span>
									<span className="stars">{Array.from({ length: recipe.stars }, (_, index) => (
										<i
											key={index}
											className="fa-solid fa-star"
											style={{ fontSize: "1rem", color: "gold" }}></i>
									))}</span>
								</div>
							) : (
								<span>
									<a href={`/recipes/${recipe._id}`}>{recipe.name}</a>
								</span>
							)}
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
