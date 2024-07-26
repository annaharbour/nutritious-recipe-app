import React from "react";

function Nutrients({ recipe, loading, panelOpen, onClose }) {
	const classifications = [
		"General",
		"Protein",
		"Lipids",
		"Carbohydrates",
		"Minerals",
		"Vitamins",
	];

	const nutrientList = classifications.map((classification) => {
		// Filter nutrients by classification and sort them
		const sortedNutrients = recipe
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
			<div className="nutrient-grid" key={classification}>
				<h4 className="classification">{classification}</h4>
				<ul className="nutrients">
					{sortedNutrients.map((nutrient) => (
						<li
							className="nutrient"
							key={nutrient._id}
							style={{
								fontWeight: nutrient.isMacroNutrient ? "bold" : "normal",
							}}>
							{nutrient.name}:{" "}
							{Math.round((nutrient.amount + Number.EPSILON) * 10) / 10}{" "}
							{nutrient.unit}
						</li>
					))}
				</ul>
			</div>
		);
	});

	return (panelOpen && recipe.length > 0) && (
		<div className="panel">
			<i className="fa fa-x" onClick={onClose}/>
			<h2>Nutrition</h2>
			{loading ? <div>Loading...</div> : nutrientList}
		</div>
	);
}

export default Nutrients;
