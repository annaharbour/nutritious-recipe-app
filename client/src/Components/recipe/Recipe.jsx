import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { getRecipeById } from "../../services/recipeService";
import { getUserById } from "../../services/userService";
import { useAuth } from "../auth/AuthContext";
import NotFound from "../layout/NotFound";
import Ingredients from "./Ingredients";
import Nutrients from "./Nutrients";
import SaveRecipe from "./SaveRecipe";
import Rating from "./Rating";

function Recipe() {
	const userInfo = useAuth().userInfo;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { id } = useParams();
	const [recipe, setRecipe] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const recipeData = await getRecipeById(id);
				if (recipeData) {
					setRecipe(recipeData);

					const userData = await getUserById(recipeData.userId);
					if (userData) {
						setUser(userData);
					}
				} else {
					setError("Recipe not found");
				}
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch data. Please try again later.");
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

	if (!recipe || !user) {
		return <NotFound message="Recipe not found." />;
	}

	return loading ? (
		<p>Loading...</p>
	) : (
		<div>
			<h1>{recipe.name}</h1>
			{userInfo && <Rating recipe={recipe} />}
			{user && <p>by {user.name}</p>}
			<Link to={`/recipes/${recipe._id}/comments`}>View Comments</Link>
			<Ingredients ingredients={recipe.ingredients} />
			<Nutrients recipe={recipe.nutrition} />
			{userInfo ? (
				<Link to="/login">Save Recipe</Link>
			) : (
				<SaveRecipe recipe={recipe._id} />
			)}
		</div>
	);
}

export default Recipe;
