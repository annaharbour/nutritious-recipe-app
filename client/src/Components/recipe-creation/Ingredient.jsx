import React, { useState } from "react";
import { getIngredientNutrition } from "../../services/ingredientService";

function Ingredient({ ingredient, index, handleRemoveIngredient }) {
	const [ingredientNutrition, setIngredientNutrition] = useState([]);
	const handleFetchIngredientNutrition = async () => {
		try {
			const amount = ingredient.amount;
			const res = await getIngredientNutrition(
				ingredient._id,
				ingredient.portionId,
				amount
			);
			setIngredientNutrition(res.nutrition);
		} catch (error) {
			console.error("Error fetching ingredient nutrition:", error);
		}
	};

	return (
		<>
			<li key={index} onClick={handleFetchIngredientNutrition}>
				{ingredient.amount} {ingredient.modifier} of{" "}
				{ingredient.description.toLowerCase()}
				<button onClick={handleRemoveIngredient(ingredient)}>Remove</button>
			</li>
			{ingredientNutrition &&
				ingredientNutrition.map(
					(nutrient, index) =>
						nutrient.isMacroNutrient && (
							<li key={index}>
								{nutrient.name}: {nutrient.amount} {nutrient.unit}
							</li>
						)
				)}
		</>
	);
}

export default Ingredient;
