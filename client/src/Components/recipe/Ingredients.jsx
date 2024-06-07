import React from "react";

function Ingredients({ recipe }) {
	const ingredientCategories = [
		"Protein",
		"Vegetable",
		"Fruit",
		"Fat",
		"Booster",
		"Nut and Seed Products",
		"Liquid",
	];

	// Create a list of ingredients for each category
	const ingredientList = ingredientCategories.map((category) => {
		const ingredients = recipe.ingredients.filter(
			(ingredient) => ingredient.category === category
		);
		if (ingredients.length === 0) {
			return null;
		}
		return (
			<div key={category}>
				<h3>{category}</h3>
				<ul>
					{ingredients.map((ingredient) => (
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
