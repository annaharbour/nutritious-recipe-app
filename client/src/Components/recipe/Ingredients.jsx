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
			<div className="recipe-ingredients" key={category}>
				<h3>{category}</h3>
				<ul>
					{categoryIngredients.map((ingredient) => (
						<li className="ingredient" key={ingredient._id}>
							<img className="ingredient-image" src={ingredient.imageUrl} alt={ingredient.description} />
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
