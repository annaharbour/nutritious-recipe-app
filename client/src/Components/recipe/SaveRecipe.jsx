import React, { useState, useEffect } from "react";
import { toggleSaveRecipe } from "../../services/recipeService";
import { getUserFavorites } from "../../services/userService";
function SaveRecipe({ recipe, showToast }) {
	const [loading, setLoading] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	useEffect(() => {
		const fetchSavedRecipes = async () => {
			try {
				setLoading(true);
				const res = await getUserFavorites();
				setIsSaved(res.includes(recipe));
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		};
		fetchSavedRecipes();
	}, [recipe]);

	const toggleSave = async () => {
		try {
			setLoading(true);
			const res = await toggleSaveRecipe(recipe);
			setIsSaved(res.data.includes(recipe));
			setLoading(false);
			showToast(isSaved ? "Recipe unsaved successfully!" : "Recipe saved successfully", "success")
		} catch (err) {
			showToast(err.message, "error");
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
