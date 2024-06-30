import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { getRecipeById, toggleSaveRecipe } from "../../services/recipeService";
import { getUserById, getUserFavorites } from "../../services/userService";
import { useAuth } from "../auth/AuthContext";
import NotFound from "../layout/NotFound";
import Ingredients from "./Ingredients";
import Nutrients from "./Nutrients";
import Rating from "./Rating";

function Recipe({ showToast }) {
	const userInfo = useAuth().userInfo;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { id } = useParams();
	const [recipe, setRecipe] = useState(null);
	const [user, setUser] = useState(null);
	const [isSaved, setIsSaved] = useState(false);

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

	useEffect(() => {
		const fetchSavedRecipes = async () => {
			try {
				if (userInfo) {
					setLoading(true);
					const res = await getUserFavorites(userInfo._id);
					setIsSaved(res.includes(id));
					setLoading(false);
				}
			} catch (err) {
				setLoading(false);
			}
		};

		fetchSavedRecipes();
	}, [userInfo, id]);

	const toggleSave = async () => {
		try {
			setLoading(true);
			const res = await toggleSaveRecipe(recipe._id);
			setIsSaved(res.includes(recipe._id));
			showToast(
				isSaved ? "Recipe unsaved successfully!" : "Recipe saved successfully!",
				"success"
			);
			setLoading(false);
		} catch (err) {
			showToast(err.message, "error");
			setLoading(false);
		}
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <NotFound message={error} />;
	}

	if (!recipe || !user) {
		return <NotFound message="Recipe not found." />;
	}

	return (
		<div>
			<h1>{recipe.name}</h1>
			{userInfo && <Rating showToast={showToast} recipe={recipe} />}
			{user && (
				<p>
					<Link to={`/profiles/${user._id}`}>{user.name}</Link>
				</p>
			)}
			<Link to={`/recipes/${recipe._id}/comments`}>View Comments</Link>
      <div>{recipe.labels.map((label) => (`${label} `))}</div>
			<Ingredients ingredients={recipe.ingredients} />
			<Nutrients recipe={recipe.nutrition} />
			{userInfo ? (
				<button onClick={toggleSave} disabled={loading}>
					{isSaved ? "Unsave Recipe" : "Save Recipe"}
				</button>
			) : (
				<Link to="/login">Save Recipe</Link>
			)}
		</div>
	);
}

export default Recipe;
