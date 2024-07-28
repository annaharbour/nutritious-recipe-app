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
			{loading && <i className="fa fa-spinner spinner"></i>}
			{recipes && recipes.length !== 0 ? (
				<ul className="trending recipe-list">
					{recipes.map((recipe) => (
						<li key={recipe._id}>
							<span>
								<span className="number">{recipes.indexOf(recipe) + 1}</span>
							</span>
							<Link to={`/recipes/${recipe._id}`}>
								<h4>{recipe.name}</h4>
							</Link>
							<span className="recipe labels">
								{recipe.labels.map((label) => (
									<span
										key={label}
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
					<p>
						Oops! We're having an error in our rating system. Check back later!
					</p>
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
