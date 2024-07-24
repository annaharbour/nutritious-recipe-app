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
		<div className="recipes">
			<div className="header">
				<div className="user-recipes img"/>
				<h1>Your Recipes</h1>
			</div>
			{loading && <p>Loading...</p>}
			{userRecipes && userRecipes.length !== 0 ? (
				<ul className="recipe-list">
					{userRecipes.map((recipe) => (
						<li>
							<Link key={recipe._id} to={`/recipes/${recipe._id}`}>
								<h4>{recipe.name}</h4>
							</Link>
							<span className="recipe labels">
								{recipe.labels.map((label) => (
									<span
										className={`label ${label
											.toLowerCase()
											.replace(/\s+/g, "-")}`}>
										{label}
									</span>
								))}
							</span>
							<span>Serves {recipe.servings}</span>
						</li>
					))}
				</ul>
			) : (
				<div>
					<p>No favorite recipes yet</p>
				</div>
			)}
			<div className="links">
				<Link to="/recipes/create"><i className="fa fa-plus"/>Create a New Recipe</Link>
				<Link to="/dashboard"><i className="fa fa-arrow-left"/>Back to Dashboard</Link>
			</div>
		</div>
	);
}

export default UserRecipes;
