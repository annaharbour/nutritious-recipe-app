import React from "react";

function Ingredients({ ingredients }) {
	const ingredientCategories = [
		"Protein",
		"Vegetable",
		"Fruit",
		"Fat",
		"Nuts & Seeds",
		"Liquid",
	];

	// Create a list of ingredients for each category
	const ingredientList = ingredientCategories.map((category) => {
		const categoryIngredients = ingredients.filter(
			(ingredient) => ingredient.category === category
		);
		if (categoryIngredients.length === 0) {
			return null;
		}
		return (
			<div key={category}>
				<h3>{category}</h3>
				<ul>
					{categoryIngredients.map((ingredient) => (
						<li key={ingredient._id}>
							{ingredient.description}: {ingredient.amount}{" "}
							{ingredient.modifier}
						</li>
					))}
				</ul>
			</div>
		);
	});

	return (
		<>
			<h2>Ingredients</h2>
			{ingredientList}
		</>
	);
}

export default Ingredients;
