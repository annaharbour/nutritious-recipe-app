import React from "react";

function RecipeIngredients({ handleRemoveIngredient, recipeIngredients }) {
	return (
		<div>
			<h4>Selected Ingredients:</h4>
			<ul>
				{recipeIngredients.map((ingredient, index) => (
					<li key={index}>
						{ingredient.description} ({ingredient.category})<br></br>
						{ingredient.amount} {ingredient.modifier}
						<button onClick={handleRemoveIngredient(ingredient)}>Remove</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default RecipeIngredients;
