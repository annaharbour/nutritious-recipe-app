import React, { useEffect, useState } from "react";
import { getRecipeById } from "../../services/recipeService";
import { getUserById } from "../../services/userService";
import { getIngredientById } from "../../services/ingredientService";
import NotFound from "../layout/NotFound";
import { useParams } from "react-router";

function Recipe() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { id } = useParams();
	const [recipe, setRecipe] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const recipeData = await getRecipeById(id);
				if (recipeData) {
					setRecipe(recipeData);
					console.log("Recipe:", recipeData);

					const userData = await getUserById(recipeData.userId);
					if (userData) {
						console.log("User:", userData);
						setUser(userData);
					}

					// const ingredientsData = await Promise.all(
					// 	recipeData.ingredients.map((ingredient) =>
					// 		getIngredientById(ingredient._id)
					// 	)
					// );
					// if (ingredientsData) {
					// 	setIngredients(ingredientsData);
					// 	console.log("Ingredients:", ingredientsData)
					// }
					
				} else {
					setError("Recipe not found");
				}
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch data. Please try again later.");
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <NotFound message={error} />;
	}

	if (!recipe || !user) {
		return <NotFound message="Recipe not found." />;
	}

	return (
		<div>
			<h1>{recipe.name}</h1>
			{user && <p>by {user.name}</p>}
			<h2>Ingredients</h2>
			<ul>
				{recipe.ingredients.map((ingredient) => (
					<li key={ingredient._id}>
						{ingredient.description}: 
						{ingredient.amount}
						{ingredient.modifier}
					</li>
				))}
			</ul>
			<h2>Nutrition</h2>
			<div>
				<h3>General</h3>
				{/* <ul>
							{recipe.nutrition
								.filter(
									(nutrient) => nutrient.classification === "General"
								)
								.map((nutrient) => (
									<li key={nutrient.id}>
										{nutrient.name}: {nutrient.amount}
									</li>
								))}
						</ul> */}
				<h3>Macronutrients</h3>
				{/* <ul>
							{recipe.nutrition
								.filter(
									(nutrient) => nutrient.classification === "Macronutrient"
								)
								.map((nutrient) => (
									<li key={nutrient.id}>
										{nutrient.name}: {nutrient.amount}
									</li>
								))}
						</ul> */}
				<h3>Proteins</h3>
				{/* <ul>
							{recipe.nutrition
								.filter(
									(nutrient) => nutrient.classification === "Protein"
								)
								.map((nutrient) => (
									<li key={nutrient.id}>
										{nutrient.name}: {nutrient.amount}
									</li>
								))}
						</ul> */}
				<h3>Carbohydrates</h3>
				{/* <ul>
							{recipe.nutrition
								.filter(
									(nutrient) => nutrient.classification === "Carbohydrates"
								)
								.map((nutrient) => (
									<li key={nutrient.id}>
										{nutrient.name}: {nutrient.amount}
									</li>
								))}
						</ul> */}
				<h3>Fat</h3>
				{/* <ul>
							{recipe.nutrition
								.filter(
									(nutrient) => nutrient.classification === "Fat"
								)
								.map((nutrient) => (
									<li key={nutrient.id}>
										{nutrient.name}: {nutrient.amount}
									</li>
								))}
						</ul> */}
				<h3>Minerals</h3>
				{/* <ul>
							{recipe.nutrition
								.filter(
									(nutrient) => nutrient.classification === "Mineral"
								)
								.map((nutrient) => (
									<li key={nutrient.id}>
										{nutrient.name}: {nutrient.amount}
									</li>
								))}
						</ul> */}
				<h3>Vitamins</h3>
				{/* <ul>
							{recipe.nutrition
								.filter(
									(nutrient) => nutrient.classification === "Vitamin"
								)
								.map((nutrient) => (
									<li key={nutrient.id}>
										{nutrient.name}: {nutrient.amount}
									</li>
								))}
						</ul> */}
				<h3>Minerals</h3>
				{/* <ul>
							{recipe.nutrition
								.filter(
									(nutrient) => nutrient.classification === "Mineral"
								)
								.map((nutrient) => (
									<li key={nutrient.id}>
										{nutrient.name}: {nutrient.amount}
									</li>
								))}
						</ul> */}
			</div>
		</div>
	);
}

export default Recipe;
