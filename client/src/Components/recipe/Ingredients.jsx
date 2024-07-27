import React from "react";

function Ingredients({ ingredients }) {

	const sortedIngredients = ingredients.sort((a, b) =>
		a.category.toString().localeCompare(b.category.toString())
	);

	return (
		<div className="recipe-ingredients">
		<ul>
			{sortedIngredients.map((ingredient) => (
				<li className="ingredient" key={ingredient._id}>
					<img
						className="ingredient-image"
						src={ingredient.imageUrl}
						alt={ingredient.description}
					/>
					{ingredient.description}: {ingredient.amount} {ingredient.modifier}
				</li>
			))}
		</ul>
		</div>
	);
}

export default Ingredients;
