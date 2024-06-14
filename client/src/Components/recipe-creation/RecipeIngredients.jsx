import React from "react";

function RecipeIngredients({ handleRemoveIngredient, recipeIngredients }) {
	const ingredients = recipeIngredients.sort((a, b) => 
		a.category.toString().localeCompare(b.category.toString())
	);

	return (
		<div>
			<h4>Selected Ingredients:</h4>
			<ul>
				{ingredients.map((ingredient, index) => (
					<li key={index}>
						{ingredient.amount} {ingredient.modifier} of {ingredient.description.toLowerCase()}			
						<button onClick={handleRemoveIngredient(ingredient)}>Remove</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default RecipeIngredients;
