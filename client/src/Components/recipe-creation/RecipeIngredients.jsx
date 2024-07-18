import React from "react";
import Ingredient from "./Ingredient";

function RecipeIngredients({ handleRemoveIngredient, recipeIngredients }) {
	const ingredients = recipeIngredients.sort((a, b) =>
		a.category.toString().localeCompare(b.category.toString())
	);

	return (
		<div className="recipe-ingredients">
			<h3>Recipe Ingredients</h3>
			<ul>
				{ingredients.map((ingredient) => (
					<Ingredient
						key={ingredient._id}
						ingredient={ingredient}
						handleRemoveIngredient={handleRemoveIngredient}
					/>
				))}
			</ul>
		</div>
	);
}

export default RecipeIngredients;
