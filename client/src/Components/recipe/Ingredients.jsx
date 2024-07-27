import React from "react";

function Ingredients({ ingredients }) {

	const sortedIngredients = ingredients.sort((a, b) =>
		a.category.toString().localeCompare(b.category.toString())
	);

	return (
		<ul className="recipe-ingredients">
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
	);
}

export default Ingredients;
