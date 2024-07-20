import React, { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { getIngredientNutrition } from "../../services/ingredientService";

const Ingredient = ({ ingredient, handleRemoveIngredient }) => {
	const [showChart, setShowChart] = useState(false);
	const [macros, setMacros] = useState([]);
	const [calories, setCalories] = useState(0);

	const handleFetchIngredientNutrition = async (id) => {
		try {
			const res = await getIngredientNutrition(
				ingredient._id,
				ingredient.portionId,
				ingredient.amount
			);
			setMacros(res.macros);
			setCalories(res.energy);
		} catch (error) {
			console.error("Error fetching ingredient nutrition:", error);
		}
	};
	const handleImageClick = async () => {
		await handleFetchIngredientNutrition(ingredient._id);
		setShowChart(!showChart);
	};

	const macroData = macros.map((nutrient) => ({
		title: nutrient.name,
		value: nutrient.amount,
		color:
			nutrient.name === "Protein"
				? "#00b4d8ff"
				: nutrient.name === "Carbohydrates"
				? "#699b46"
				: nutrient.name === "Fat" && "#ff9e00ff",
	}));

	return (
		<div className="ingredient">
			<li key={ingredient._id} onClick={handleImageClick}>
				<div className="image-container">
					<img
						src={ingredient.imageUrl}
						alt={ingredient.description}
						className="ingredient-image"
					/>
					{showChart && (
						<div className="chart">
							<PieChart
								data={macroData}
								lineWidth={30}
								segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
								label={({ dataEntry }) => `${Math.round(dataEntry.value)}g`}
								labelStyle={{
									fontSize: ".5rem",
									fontWeight: "750",
									fontFamily: "sans-serif",
									fill: "#14281f",
								}}
								labelPosition={85}
								animate
							/>
							<span className="calories">
								{Math.floor(calories.amount)} kcal
							</span>
						</div>
					)}
				</div>
				<div>
					{ingredient.description}: {ingredient.amount} {ingredient.modifier}
					
				</div>
				<i
						className="fa fa-x"
						onClick={() => handleRemoveIngredient(ingredient)}
					/>
			</li>
		</div>
	);
};

export default Ingredient;
