import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getIngredientsByCategory } from "../../services/ingredientService";
import {
	createRecipe,
	calculateRecipeNutrition,
} from "../../services/recipeService";
import Nutrients from "../recipe/Nutrients";
import RecipeIngredients from "./RecipeIngredients";

const RecipeForm = ({showToast}) => {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false);
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
		"Nuts & Seeds",
		"Liquid",
		"Flavor",
	];

	const [category, setCategory] = useState(ingredientCategories[0]);

	useEffect(() => {
		
		
		// Fetch the ingredients for the selected category
		const fetchIngredients = async (category) => {
			try {
				setLoading(true);
				const res = await getIngredientsByCategory(category);
				setIngredients(res.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching ingredients:", error);
			}
		};

		fetchIngredients(category);
	}, [category]);

	// Fetch the nutrition information for the recipe
	const fetchRecipeNutrition = async (recipeIngredients) => {
		try {
			setLoading(true);
			if (recipeIngredients.length === 0) return;
			const res = await calculateRecipeNutrition({
				ingredients: recipeIngredients,
			});
			setRecipeNutrition(res.data);
			setLoading(false);
		} catch (error) {
			console.error("Error calculating recipe nutrition:", error);
		}
	};

	useEffect(() => {
		fetchRecipeNutrition(recipeIngredients);
	}, [recipeIngredients]);

	const handleRecipeNameChange = (e) => {
		setLoading(true);
		setRecipeName(e.target.value);
		setLoading(false);
	};

	const handleAddIngredient = (e) => {
		e.preventDefault();
		if (!selectedIngredient) return;

		// Find the selected ingredient and portion
		const ingredient = ingredients.find((i) => i._id === selectedIngredient);

		const portion = ingredient.foodPortions.find(
			(p) => p._id === Number(selectedPortion)
		);
		// TODO: Add toast
		if(!portion) return alert('Please select a portion')

		// Add the ingredient to the recipe
		if (recipeIngredients.length < 5) {
			setLoading(true);
			setRecipeIngredients([
				...recipeIngredients,
				{
					...ingredient,
					amount: selectedAmount,
					portionId: portion._id,
					modifier: portion.modifier,
				},
			]);
			setLoading(false);
		} else {
			alert("You can only add up to 5 ingredients");
		}
		// Reset the form
		setSelectedIngredient(null);
		setSelectedPortion("");
		setSelectedAmount(1);
	};

	const handleRemoveIngredient = (ingredient) => () => {
		setLoading(true);
		setRecipeIngredients(
			recipeIngredients.filter((i) => i._id !== ingredient._id)
		);
		setLoading(false);
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
			// TODO: Add toast
			if (recipeIngredients.length === 0) return alert('Please add ingredients')
			if (!recipeName) return alert('Please enter a recipe name')
			await createRecipe(recipeName, recipeIngredients);
			navigate('/dashboard')
		} catch (error) {
			console.error("Error saving recipe:", error);
			showToast("Error saving recipe");
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
				{recipeIngredients.length > 0 && (
					<>
						<RecipeIngredients
							recipeIngredients={recipeIngredients}
							handleRemoveIngredient={handleRemoveIngredient}
						/>
						<br></br>
						<button disabled={loading} type="submit">Post Recipe</button>
						<Nutrients recipe={recipeNutrition} />
					</>
				)}
			</form>
		</div>
	);
};

export default RecipeForm;
