import React from "react";
import Ingredient from "./Ingredient";

function RecipeIngredients({ handleRemoveIngredient, recipeIngredients }) {
	const ingredients = recipeIngredients.sort((a, b) =>
		a.category.toString().localeCompare(b.category.toString())
	);

	return (
		<div className="recipe-ingredients">
			<h3>Recipe Ingredients</h3>
			<ul className="graph-guide">
				<li>
					<i className="fas fa-square" style={{color: '#00b4d8ff'}}/>
					<span>Protein</span>
				</li>
				<li>
					<i className="fas fa-square" style={{color: '#699b46'}}/>
					<span>Carbohydrates</span>
				</li>
				<li>
					<i className="fas fa-square" style={{color: '#ff9e00ff'}}/>
					<span>Fat</span>
				</li>
				
			</ul>

			<ul>
				{ingredients.map((ingredient) => (
					<Ingredient
						key={ingredient._id}
						ingredient={ingredient}
						handleRemoveIngredient={handleRemoveIngredient}
					/>
				))}
			</ul>
		</div>
	);
}

export default RecipeIngredients;
