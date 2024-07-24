import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getUserFavorites } from "../../services/userService";

function FavoriteRecipes() {
	const [loading, setLoading] = useState(false);
	const userInfo = useAuth().userInfo;
	const [favorites, setFavorites] = useState([]);
	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				setLoading(true);
				const res = await getUserFavorites();
				console.log(res);
				setFavorites(res);
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		};

		fetchFavorites();
	}, [userInfo]);

	return (
		<div className="recipes">
			<div className="header">
				<div className="favorites img"/>
				<h1>Your Saved Recipes</h1>
			</div>
			
			{loading && <p>Loading...</p>}
			{favorites && favorites.length !== 0 ? (
				<ul className="recipe-list">
					{favorites.map((recipe) => (
						<li>
							<Link key={recipe._id} to={`/recipes/${recipe._id}`}>
								<h4>{recipe.name}</h4>
							</Link>
							<span className="recipe labels">
								{recipe.labels.map((label) => (
									<span
										className={`label ${label
											.toLowerCase()
											.replace(/\s+/g, "-")}`} key={label}>
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
				<Link to="/recipes/search"><i className="fa fa-magnifying-glass"/>Find New Recipes</Link>
				<Link to="/dashboard"><i className="fa fa-arrow-left"/>Back to Dashboard</Link>
			</div>
		</div>
	);
}

export default FavoriteRecipes;
