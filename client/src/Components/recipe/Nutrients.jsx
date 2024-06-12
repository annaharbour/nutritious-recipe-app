import React from "react";

function Nutrients({ recipe }) {
	const classifications = [
		"General",
		"Protein",
		"Lipids",
		"Carbohydrates",
		"Minerals",
		"Vitamins",
	];

	const nutrientList = classifications.map((classification) => {
		const nutrients = recipe.nutrition;
		// Filter nutrients by classification and sort them
		const sortedNutrients = nutrients
			.filter((nutrient) => nutrient.classification === classification)
			.sort((a, b) => {
				if (a.isMacroNutrient && !b.isMacroNutrient) {
					return -1;
				} else if (!a.isMacroNutrient && b.isMacroNutrient) {
					return 1;
				} else {
					return a.name.localeCompare(b.name);
				}
			});

		return (
			<div key={classification}>
				<h3>
					<u>{classification}</u>
				</h3>
				<ul>
					{sortedNutrients.map((nutrient) => (
						<li
							key={nutrient._id}
							style={{ fontWeight: nutrient.isMacroNutrient ? "bold" : "normal" }}
						>
							{nutrient.name}:{" "}
							{Math.round((nutrient.amount + Number.EPSILON) * 10) / 10}{" "}
							{nutrient.unit}
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
