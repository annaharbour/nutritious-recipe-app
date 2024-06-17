import React from "react";
import Ingredient from "./Ingredient";

function RecipeIngredients({ handleRemoveIngredient, recipeIngredients }) {
	const ingredients = recipeIngredients.sort((a, b) =>
		a.category.toString().localeCompare(b.category.toString())
	);

	return (
		<div>
			<h4>Selected Ingredients:</h4>
			<ul>
				{ingredients.map((ingredient, index) => (
					<Ingredient
						key={index}
						ingredient={ingredient}
						index={index}
						handleRemoveIngredient={handleRemoveIngredient}
					/>
				))}
			</ul>
		</div>
	);
}

export default RecipeIngredients;
