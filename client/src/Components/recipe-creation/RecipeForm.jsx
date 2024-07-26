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
	const [panelOpen, setPanelOpen] = useState(true);

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

	const fetchRecipeNutrition = async () => {
		try {
			setLoading(true);
			if (recipeIngredients.length === 0) {
				showToast("Please add ingredients to calculate nutrition", "error");
				return;
			};

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
			setTimeout(() => setPanelOpen(true), 1000);
		} catch (error) {
			console.error("Error calculating recipe nutrition:", error);
			showToast("Error calculating recipe nutrition", "error");
		} finally {
			console.log("Recipe Nutrition:", recipeNutrition);
			setLoading(false);
		}
	};

	const handleRecipeNameChange = (e) => {
		e.preventDefault();
		setRecipeName(e.target.value);
	};

	const handleServingsChange = (e) => {
		e.preventDefault();
		setServings(e.target.value);
	};

	const handleAddIngredient = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
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
				showToast("You can only add up to a dozen ingredients");
			}

			setSelectedIngredient(null);
			setSelectedPortion("");
			setSelectedAmount(1);
		} catch {
			showToast("Error adding ingredient, please try again", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveIngredient = (ingredient) => {
		try {
			const updatedIngredients = recipeIngredients.filter(
				(i) => i._id !== ingredient._id
			);
			setRecipeIngredients(updatedIngredients);
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
			const hasLiquid = recipeIngredients.some(
				(ingredient) => ingredient.classification === "Liquid"
			);

			if (!hasLiquid) {
				showToast("Liquid required", "error");
				setCategory("Liquid");
				return;
			}

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
				<div className="form-group portion">
					<label htmlFor="servings">Servings:</label>
					<input
						type="number"
						id="servings"
						onChange={handleServingsChange}
						onInput={(e) => {
							if (e.target.value > 12) {
								e.target.value = 12;
							}
						}}
						value={servings}
						min="1"
						max="12"
					/>
				</div>
				<div className="form-group category">
					<label htmlFor="category">
						<i className="fa fa-caret-left" onClick={handleGoBack} />
						<span
							className="category-prev"
							style={{
								opacity: ingredientCategories.indexOf(category) > 0 ? 0.5 : 0,
							}}>
							{
								ingredientCategories[
									(ingredientCategories.indexOf(category) -
										1 +
										ingredientCategories.length) %
										ingredientCategories.length
								]
							}
						</span>
						<span className="category-current"> {category} </span>
						<span
							className="category-next"
							style={{
								opacity:
									ingredientCategories.indexOf(category) <
									ingredientCategories.length - 1
										? 0.5
										: 0,
							}}>
							{
								ingredientCategories[
									(ingredientCategories.indexOf(category) + 1) %
										ingredientCategories.length
								]
							}
						</span>
						<i className="fa fa-caret-right" onClick={handleGoForward} />
					</label>
				</div>

				<div>
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
				</div>
				<div className="portion form-group">
					<div>
						<label htmlFor="portion">Portion:</label>

						<div className="portion">
							<input
								className="amount"
								type="number"
								value={selectedAmount}
								min="1"
								max="12"
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
							<i
								className="fa fa-plus"
								onClick={handleAddIngredient}
								disabled={loading}
								style={{ color: loading && "gray" }}
							/>
						</div>
					</div>
				</div>

				{recipeIngredients && recipeIngredients.length > 0 && (
					<>
						<RecipeIngredients
							recipeIngredients={recipeIngredients}
							handleRemoveIngredient={handleRemoveIngredient}
						/>
						<br></br>
						<button
							className="btn btn-primary"
							disabled={loading}
							type="submit">
							Post Recipe
						</button>
						<button className="btn btn-primary" disabled={loading} onClick={fetchRecipeNutrition}>
							Nutrition
						</button>
						{loading && <p>Loading...</p>}
					</>
				)}
			</form>

			{recipeNutrition.length > 0 && <Nutrients recipe={recipeNutrition} loading={loading} panelOpen={panelOpen} onClose={() => setPanelOpen(false)}/>}
		</div>
	);
};

export default RecipeForm;
