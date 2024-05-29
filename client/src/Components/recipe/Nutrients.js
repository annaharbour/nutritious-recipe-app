import React from "react";

function Nutrients({ recipe }) {
	const nutrientClassifications = [
		"General",
		"Macronutrients",
		"Protein",
		"Carbohydrates",
		"Minerals",
		"Vitamins",
	];

	const nutrientList = nutrientClassifications.map((classification) => {
		const nutrients = recipe.nutrition.filter(
			(nutrient) => nutrient.classification === classification
		);
		if (nutrients.length === 0) {
			return null;
		}
		return (
			<div>
				<h3>{classification}</h3>
				<ul>
					{nutrients.map((nutrient) => (
						<li key={nutrient._id}>
							{nutrient.description}:{nutrient.amount}
							{nutrient.modifier}
						</li>
					))}
				</ul>
			</div>
		);
	});

	return (
		<>
			<h2>Nutrition</h2>
			{nutrientList}
		</>
	);
}

export default Nutrients;
