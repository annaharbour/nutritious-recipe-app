import React, { useEffect, useState } from "react";
import { getRecipeById } from "../../services/recipeService";
import { getUserById } from "../../services/userService";
import NotFound from "../layout/NotFound";
import { useParams } from "react-router";
import Ingredients from "./Ingredients";
import Nutrients from "./Nutrients";

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

			<Ingredients recipe={recipe}	/>
			<Nutrients recipe={recipe} />
		</div>
	);
}

export default Recipe;
