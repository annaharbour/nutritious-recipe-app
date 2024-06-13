import React, { useState, useEffect } from "react";
import { toggleSaveRecipe } from "../../services/recipeService";
import { getUserFavorites } from "../../services/userService";

function SaveRecipe({ recipe }) {
	const [loading, setLoading] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	useEffect(() => {
		const fetchSavedRecipes = async () => {
			try {
				setLoading(true);
				const res = await getUserFavorites();
				setIsSaved(res.includes(recipe._id));
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		};
		fetchSavedRecipes();
	}, [recipe._id]);

	const toggleSave = async () => {
		try {
			setLoading(true);
			const res = await toggleSaveRecipe(recipe._id);
			setIsSaved(res.data.includes(recipe._id));
			setLoading(false);
			alert(isSaved ? "Recipe unsaved successfully!" : "Recipe saved successfully!");
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<div>
			<button onClick={toggleSave} disabled={loading}>
				{loading ? "Saving..." : (isSaved ? "Unsave Recipe" : "Save Recipe")}
			</button>
		</div>
	);
}

export default SaveRecipe;
