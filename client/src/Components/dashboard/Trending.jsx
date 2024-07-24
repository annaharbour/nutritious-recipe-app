import React, { useState, useEffect } from "react";
import { getRecipes } from "../../services/recipeService";
import { Link } from "react-router-dom";

function Trending() {
	const [loading, setLoading] = useState(false);
	const [recipes, setRecipes] = useState([]);
	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				setLoading(true);
				const res = await getRecipes();
				setRecipes(res.data);
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		};
		fetchRecipes();
	}, []);

	return (
		<div className="recipes">
			<div className="header">
				<div className="trending img" />
				<h1>Trending Recipes</h1>
			</div>
			{loading && <p>Loading...</p>}
			{recipes && recipes.length !== 0 ? (
				<ul className="trending recipe-list">
					{recipes.map((recipe) => (
						<li>
							<span>
								<span className="number">{recipes.indexOf(recipe) + 1}</span>
							</span>
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
				<Link to="/dashboard">
					<i className="fa fa-arrow-left" />
					Back to Dashboard
				</Link>
			</div>
		</div>
	);
}

export default Trending;
