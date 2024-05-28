import React, { useEffect, useState } from "react";
import { getRecipeById } from "../../services/recipeService";
import NotFound from "../layout/NotFound";
import { useParams } from "react-router";

function Recipe() {
	const [recipe, setRecipe] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [user, setUser] = useState(null);
	const {id} = useParams();


	useEffect(() => {
		const fetchData = async () => {
		  try {
			setLoading(true);
			const recipeData = await getRecipeById(id); // Use the route parameter here
			if (recipeData) {
			  setRecipe(recipeData);
			//   const userData = await getUserById(recipeData.userId);
			//   setUser(userData);
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

    // if (!recipe || !user) {
    //     return <NotFound message="Recipe not found." />;
    // }


	return (


				<div>
					{/* <h1>{recipe.name}</h1> */}
					{/* <p>by {user.name}</p> */}
					{/* <ul>
						{recipe.ingredients.map((ingredient) => (
							<li key={ingredient._id}>{ingredient.name}</li>
						))}
					</ul> */}
					<h2>Nutrition</h2>
					<div>
						<h2>Nutrition</h2>
                        
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

