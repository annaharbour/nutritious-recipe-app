import React from "react";

function Ingredients({ ingredients, servings }) {
	const ingredientCategories = [
		"Protein",
		"Vegetable",
		"Fruit",
		"Fat",
		"Nuts & Seeds",
		"Liquid",
	];

	const ingredientList = ingredientCategories.map((category) => {
		const categoryIngredients = ingredients.filter(
			(ingredient) => ingredient.category === category
		);
		if (categoryIngredients.length === 0) {
			return null;
		}
		return (
			<div className="recipe-ingredients" key={category}>
			
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
			<h3>Recipe</h3>
			<span className="portion">Serves {servings}</span>
			{ingredientList}
		</>
	);
}

export default Ingredients;
