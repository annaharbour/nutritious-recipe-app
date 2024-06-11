import React, { useState, useEffect } from "react";
import { getIngredientsByCategory } from "../../services/ingredientService";
import {
	createRecipe,
	calculateRecipeNutrition,
} from "../../services/recipeService";
import Nutrition from "./Nutrition";

const RecipeForm = () => {
	const [recipeName, setRecipeName] = useState("");
	const [recipeIngredients, setRecipeIngredients] = useState([]);
	const [ingredients, setIngredients] = useState([]);
	const [selectedIngredient, setSelectedIngredient] = useState(null);
	const [selectedPortion, setSelectedPortion] = useState("");
	const [selectedAmount, setSelectedAmount] = useState(1);
	const [recipeNutrition, setRecipeNutrition] = useState([]);
	const ingredientCategories = [
		"Fruit",
		"Vegetable",
		"Protein",
		"Fat",
		"Nuts & Seeds",
		"Liquid",
		"Flavor",
	];

	const [category, setCategory] = useState(ingredientCategories[0]);

	useEffect(() => {
		fetchIngredients(category);
	}, [category]);

	const fetchIngredients = async (category) => {
		try {
			const res = await getIngredientsByCategory(category);
			setIngredients(res.data);
			console.log("Fetched ingredients:", res.data);
		} catch (error) {
			console.error("Error fetching ingredients:", error);
		}
	};

	const fetchRecipeNutrition = async (recipeIngredients) => {
		try {
			if (recipeIngredients.length === 0) return;
			const res = await calculateRecipeNutrition({
				ingredients: recipeIngredients,
			});
			setRecipeNutrition(res.data);
		} catch (error) {
			console.error("Error calculating recipe nutrition:", error);
		}
	};

	useEffect(() => {
		fetchRecipeNutrition(recipeIngredients);
	}, [recipeIngredients]);

	const handleRecipeNameChange = (e) => {
		setRecipeName(e.target.value);
	};

	const handleAddIngredient = (e) => {
		e.preventDefault();
		if (!selectedIngredient) return;

		const ingredient = ingredients.find((i) => i._id === selectedIngredient);
		if (!ingredient) return console.log("Ingredient not found");

		console.log("Selected Portion:", selectedPortion);
		const portion = ingredient.foodPortions.find(
			(p) => p._id === Number(selectedPortion)
		);
		console.log("Matched Portion:", portion);

		if (!portion) {
			alert("Please select a valid portion.");
			return;
		}

		if (recipeIngredients.length < 5) {
			setRecipeIngredients([
				...recipeIngredients,
				{
					...ingredient,
					amount: selectedAmount,
					portionId: portion._id,
					modifier: portion.modifier,
				},
			]);
		} else {
			alert("You can only add up to 5 ingredients");
		}
		setSelectedIngredient(null);
		setSelectedPortion("");
		setSelectedAmount(1);
	};

	const handleRemoveIngredient = (ingredient) => () => {
		setRecipeIngredients(
			recipeIngredients.filter((i) => i._id !== ingredient._id)
		);
	};

	const handleGoBack = (e) => {
		e.preventDefault();
		setCategory(
			ingredientCategories[
				(ingredientCategories.indexOf(category) -
					1 +
					ingredientCategories.length) %
					ingredientCategories.length
			]
		);
	};

	const handleGoForward = (e) => {
		e.preventDefault();
		setCategory(
			ingredientCategories[
				(ingredientCategories.indexOf(category) + 1) %
					ingredientCategories.length
			]
		);
	};

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    try {
        await createRecipe(recipeName, recipeIngredients);
        alert("Recipe saved successfully");
    } catch (error) {
        console.error("Error saving recipe:", error);
        alert("Error saving recipe");
    }
};


	return (
		<div>
			<h2>Create a Recipe</h2>
			<div>
				<button onClick={handleGoBack}>Previous Category</button>
				<button onClick={handleGoForward}>Next Category</button>
			</div>
			<form onSubmit={handleSaveRecipe}>
				<label htmlFor="recipeName">Recipe Name:</label>
				<input
					type="text"
					id="recipeName"
					value={recipeName}
					onChange={handleRecipeNameChange}
				/>
				<h3>{category}</h3>
				<select
					value={selectedIngredient || ""}
					onChange={(e) => setSelectedIngredient(e.target.value)}>
					<option value="">Select an ingredient</option>
					{ingredients &&
						ingredients.map((ingredient) => (
							<option key={ingredient._id} value={ingredient._id}>
								{ingredient.description}
							</option>
						))}
				</select>
				{selectedIngredient && (
					<div>
						<label htmlFor="portion">Portion:</label>
						<input
							type="number"
							value={selectedAmount}
							min="1"
							onChange={(e) => setSelectedAmount(e.target.value)}
						/>
						<select
							value={selectedPortion || ""}
							onChange={(e) => setSelectedPortion(e.target.value)}>
							<option value="">Select a portion</option>
							{ingredients
								.find((i) => i._id === selectedIngredient)
								?.foodPortions.map((portion) => (
									<option key={portion._id} value={portion._id}>
										{portion.modifier}
									</option>
								))}
						</select>
					</div>
				)}
				<button onClick={handleAddIngredient}>Add +</button>
				<div>
					<h4>Selected Ingredients:</h4>
					<ul>
						{recipeIngredients.map((ingredient, index) => (
							<li key={index}>
								{ingredient.description} ({ingredient.category})
                 <br></br>
                 {ingredient.amount} {ingredient.modifier}
								<button onClick={handleRemoveIngredient(ingredient)}>
									Remove
								</button>
							</li>
						))}
					</ul>
				</div>
				<button type="submit">Save Recipe</button>
				<Nutrition
					ingredients={recipeIngredients}
					recipeNutrition={recipeNutrition}
				/>
			</form>
		</div>
	);
};

export default RecipeForm;
