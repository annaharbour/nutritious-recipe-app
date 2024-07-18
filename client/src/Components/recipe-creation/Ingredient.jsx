// import React, { useState } from "react";
// import { getIngredientNutrition } from "../../services/ingredientService";

// const Ingredient = ({ ingredient, handleRemoveIngredient }) => {
// 	const [ingredientNutrition, setIngredientNutrition] = useState([]);

// 	const handleFetchIngredientNutrition = async (id) => {
// 		try {
// 			const res = await getIngredientNutrition(
// 				ingredient._id,
// 				ingredient.portionId,
// 				ingredient.amount
// 			);
// 			setIngredientNutrition(res.nutrition);
// 			console.log(ingredientNutrition);
// 		} catch (error) {
// 			console.error("Error fetching ingredient nutrition:", error);
// 		}
// 	};

// 	return (
// 		<div className="ingredient">
// 			<li key={ingredient._id}>
// 				<img
// 					src={ingredient.imageUrl}
// 					alt={ingredient.description}

// 					onMouseOver={() => handleFetchIngredientNutrition(ingredient)}
// 				/>
// 				<div>
// 					{ingredient.amount} {ingredient.modifier}{" "}
// 					{ingredient.description.toLowerCase()}
// 					<i
// 						className="fa fa-x"
// 						onClick={() => handleRemoveIngredient(ingredient)}
// 					/>
// 				</div>
// 			</li>
// 			<div>
// 				{ingredientNutrition.length > 0 &&
// 					ingredientNutrition.map(
// 						(nutrient, index) =>
// 							nutrient.isMacroNutrient && (
// 								<li key={index}>
// 									{nutrient.name}: {Math.round((nutrient.amount + Number.EPSILON) * 10) / 10}{" "} {nutrient.unit}
// 								</li>
// 							)
// 					)}
// 			</div>
// 		</div>
// 	);
// };

// export default Ingredient;

import React, { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { getIngredientNutrition } from "../../services/ingredientService";

const Ingredient = ({ ingredient, handleRemoveIngredient }) => {
  const [ingredientNutrition, setIngredientNutrition] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const handleFetchIngredientNutrition = async (id) => {
    try {
      const res = await getIngredientNutrition(
        ingredient._id,
        ingredient.portionId,
        ingredient.amount
      );
      setIngredientNutrition(res.nutrition);
    } catch (error) {
      console.error("Error fetching ingredient nutrition:", error);
    }
  };

  const handleImageClick = async () => {
    await handleFetchIngredientNutrition(ingredient._id);
    setShowChart(!showChart);
  };

  const macroData = ingredientNutrition
    .filter((nutrient) => nutrient.isMacroNutrient)
    .map((nutrient) => ({
      title: nutrient.name,
      value: nutrient.amount,
      color: nutrient.name === "Protein" ? "#f39c12" :
             nutrient.name === "Carbohydrate" ? "#e74c3c" :
             nutrient.name === "Fat" ? "#3498db" : "#2ecc71"
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
                lineWidth={20}
                segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                animate
              />
            </div>
          )}
        </div>
        <div>
          {ingredient.amount} {ingredient.modifier}{" "}
          {ingredient.description.toLowerCase()}
          <i
            className="fa fa-x"
            onClick={() => handleRemoveIngredient(ingredient)}
          />
        </div>
      </li>
    </div>
  );
};

export default Ingredient;
