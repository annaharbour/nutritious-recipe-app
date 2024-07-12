import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecipesByUserId } from "../../services/recipeService";
import { useAuth } from "../auth/AuthContext";

function UserRecipes() {
	const [loading, setLoading] = useState(false);
	const userInfo = useAuth().userInfo;
	const [userRecipes, setUserRecipes] = useState([]);
	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				setLoading(true);
				const res = await getRecipesByUserId(userInfo._id);
				setUserRecipes(res.data);
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		};
		fetchRecipes();
	}, [userInfo]);

	return (
		<div>
			{loading && <p>Loading...</p>}
			{userRecipes && userRecipes.length !== 0 ? (
				userRecipes.map((recipe) => (
					<Link key={recipe._id} to={`/recipes/${recipe._id}`}>
						<li>{recipe.name}</li>
					</Link>
				))
			) : (
				<div>
					<div>You haven't created any recipes yet!</div>
					<Link to="/recipes/create">Create a new recipe</Link>
				</div>
			)}
		</div>
	);
}

export default UserRecipes;
