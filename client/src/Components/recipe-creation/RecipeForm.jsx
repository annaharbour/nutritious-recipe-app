import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getIngredientsByCategory } from "../../services/ingredientService";
import {
	createRecipe,
	calculateRecipeNutrition,
} from "../../services/recipeService";
import Nutrients from "../recipe/Nutrients";
import RecipeIngredients from "./RecipeIngredients";

const RecipeForm = ({ showToast }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [recipeName, setRecipeName] = useState("");
	const [servings, setServings] = useState(1);
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

	useEffect(() => {
		const fetchRecipeNutrition = async (recipeIngredients) => {
			try {
				setLoading(true);
				if (recipeIngredients.length === 0) return;
				// Send only necessary fields
				const ingredientsPayload = recipeIngredients.map(
					({ _id, portionId, amount }) => ({
						_id,
						portionId,
						amount,
					})
				);

				const res = await calculateRecipeNutrition({
					ingredients: ingredientsPayload,
					servings,
				});
				setRecipeNutrition(res.data);
				setLoading(false);
			} catch (error) {
				console.error("Error calculating recipe nutrition:", error);
			}
		};

		fetchRecipeNutrition(recipeIngredients);
	}, [recipeIngredients, servings]);

	const handleRecipeNameChange = (e) => {
		setLoading(true);
		setRecipeName(e.target.value);
		setLoading(false);
	};

	const handleServingsChange = (e) => {
		setLoading(true);
		setServings(e.target.value);
		setLoading(false);
	};

	const handleAddIngredient = (e) => {
		e.preventDefault();
		if (!selectedIngredient) return;

		const ingredient = ingredients.find((i) => i._id === selectedIngredient);

		const portion = ingredient.foodPortions.find(
			(p) => p._id === Number(selectedPortion)
		);

		if (!portion || portion === undefined) {
			showToast("Please select a portion", "error");
			return;
		}

		const isIngredientAdded = recipeIngredients.some(
			(i) => i._id === ingredient._id
		);
		if (isIngredientAdded) {
			showToast(
				ingredient.description + " already included in recipe",
				"error"
			);
			return;
		}
		if (recipeIngredients.length < 12) {
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
			showToast("You can only add up to a dozen ingredients");
		}

		setSelectedIngredient(null);
		setSelectedPortion("");
		setSelectedAmount(1);
	};

	const handleRemoveIngredient = (ingredient) => () => {
		try {
			setLoading(true);
			setRecipeIngredients(
				recipeIngredients.filter((i) => i._id !== ingredient._id)
			);
			setLoading(false);
		} catch (error) {
			showToast("Error removing ingredient, please try again", "error");
		}
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
			navigate("/dashboard");
		} catch (error) {
			showToast("Error saving recipe");
		}
	};

	return (
		<div className="create-recipe">
			<h2>Create a Recipe</h2>

			<form className="form" onSubmit={handleSaveRecipe}>
				<div className="form-group">
					<label htmlFor="recipeName">Recipe Name:</label>
					<input
						type="text"
						id="recipeName"
						value={recipeName}
						onChange={handleRecipeNameChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="servings">Servings:</label>
					<input
						type="number"
						id="servings"
						onChange={handleServingsChange}
						onInput={(e) => {
							if (e.target.value > 6) {
								e.target.value = 6;
							}
						}}
						value={servings}
						min="1"
						max="6"
					/>
				</div>
				<div className="form-group">
				<label htmlFor="category">
					<i className="fa fa-arrow-left" onClick={handleGoBack} />
					{category}
					<i className="fa fa-arrow-right" onClick={handleGoForward} />
				</label>
				
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
							required
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
				</div>

				{recipeIngredients.length > 0 && (
					<>
						<RecipeIngredients
							recipeIngredients={recipeIngredients}
							handleRemoveIngredient={handleRemoveIngredient}
						/>
						<br></br>
						<button disabled={loading} type="submit">
							Post Recipe
						</button>

						{loading ? (
							<div className="loader">
								<i className="fa-solid fa-spinner spinner"></i>
							</div>
						) : (
							<Nutrients recipe={recipeNutrition} />
						)}
					</>
				)}
			</form>
		</div>
	);
};

export default RecipeForm;
