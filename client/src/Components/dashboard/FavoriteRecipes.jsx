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
				setFavorites(res);
				setLoading(false);
			} catch (err) {
				setLoading(false);
			}
		};

		fetchFavorites();
	}, [userInfo]);

	return (
		<div>
			<h3>Your favorites</h3>
			{loading && <p>Loading...</p>}
			{favorites && favorites.length !== 0 ? (
				favorites.map((recipe) => (
					<Link key={recipe._id} style={{color: 'red'}} to={`/recipes/${recipe._id}`}>
						<li>{recipe.name}</li>
					</Link>
				))
			) : (
				<div>
					<p>No favorite recipes yet</p>
					<Link to="/recipes">Find recipes</Link>
				</div>
			)}
		</div>
	);
}

export default FavoriteRecipes;
