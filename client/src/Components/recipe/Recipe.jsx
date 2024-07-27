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
import Comments from "./Comments";

function Recipe({ showToast }) {
	const userInfo = useAuth().userInfo;
	const userId = userInfo ? userInfo._id : null;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { id } = useParams();
	const [recipe, setRecipe] = useState(null);
	const [recipeAuthor, setRecipeAuthor] = useState(null);
	const [isSaved, setIsSaved] = useState(false);
	const [nutritionPanelOpen, setNutritionPanelOpen] = useState(false);
	const [commentPanelOpen, setCommentPanelOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				// Fetch recipe data
				const recipeData = await getRecipeById(id);
				if (recipeData) {
					// Set Recipe Data
					setRecipe(recipeData);
					// Find Recipe Author
					const authorData = await getUserById(recipeData.userId);
					if (authorData) {
						setRecipeAuthor(authorData);
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
		const fetchSavedRecipes = async () => {
			try {
				if (userId) {
					setLoading(true);
					const res = await getUserFavorites(userId);
					setIsSaved(res.some((item) => item._id === id));
					setLoading(false);
				}
			} catch (err) {
				setLoading(false);
			}
		};
		fetchData();
		fetchSavedRecipes();
	}, [id, isSaved, userId]);

	const toggleSave = async () => {
		try {
			setLoading(true);
			await toggleSaveRecipe(recipe._id);
			setIsSaved(!isSaved);
			showToast(
				!isSaved
					? "Recipe saved successfully!"
					: "Recipe unsaved successfully!",
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

	if (!recipe || !recipeAuthor) {
		return <NotFound message="Recipe not found." />;
	}

	return (
		<div className="recipe">
			<h1>{recipe.name}</h1>
			{recipeAuthor && (
				<h6>
					by{" "}
					<Link to={`/profiles/${recipeAuthor._id}`}>{recipeAuthor.name}</Link>
				</h6>
			)}

			<div className="ratings">
				{userInfo ? (
					<i
						className="fa-solid fa-bookmark"
						onClick={toggleSave}
						disabled={loading}
						style={{
							fontSize: "2rem",
							color: !isSaved ? "#F9F6EE" : "#ebd92d",
						}}></i>
				) : (
					<Link to="/dashboard">Create an Account to Save</Link>
				)}
				{userInfo && <Rating showToast={showToast} recipe={recipe} />}
			</div>

			<div>
				<ul className="labels">
					{recipe.labels.map((label) => (
						<li
							key={label}
							className={`label ${label.toLowerCase().replace(/\s+/g, "-")}`}>
							{label}
						</li>
					))}
				</ul>
			</div>
			<div className="links">
				<span onClick={() => setCommentPanelOpen(true)}>
					<i className="fa-solid fa-comment"></i> View Comments
				</span>
				<span onClick={() => setNutritionPanelOpen(true)}>
					<i className="fa-solid fa-glass-water"></i> View Nutrition
				</span>
			</div>
			<h3>Recipe</h3>
			<span className="portion">Serves {recipe.servings}</span>
			<Ingredients
				ingredients={recipe.ingredients}
			/>
			<Comments
				recipe={recipe._id}
				panelOpen={commentPanelOpen}
				onClose={() => setCommentPanelOpen(false)}
				showToast={showToast}
			/>
			<Nutrients
				recipe={recipe.nutrition}
				panelOpen={nutritionPanelOpen}
				onClose={() => setNutritionPanelOpen(false)}
				showToast={showToast}
			/>
		</div>
	);
}

export default Recipe;
