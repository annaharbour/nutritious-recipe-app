import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
	getUserRating,
	getMeanRating,
	rateRecipe,
} from "../../services/ratingService";

function RatingComponent({ recipe }) {
	const userInfo = useAuth().userInfo;
	const userId = userInfo._id;
	const [loading, setLoading] = useState(false);
	const [stars, setStars] = useState(null);
	const [meanRating, setMeanRating] = useState(null);

	useEffect(() => {
		const fetchUserRating = async () => {
			try {
				const res = await getUserRating(recipe._id, userId);
				if (res) {
					setStars(res.userRating);
				}
			} catch (error) {
				console.error("Error fetching user rating:", error);
			}
		};

		const fetchMeanRating = async () => {
			try {
				const res = await getMeanRating(recipe._id);
				setMeanRating(res.meanRating);
			} catch (error) {
				console.error("Error fetching mean rating:", error);
			}
		};

		fetchUserRating();
		fetchMeanRating();
	}, [recipe._id, userId]);

	const handleRateRecipe = async (stars) => {
		setLoading(true);
		try {
			const res = await rateRecipe(recipe._id, stars);
			setStars(res.userRating);
			// TODO: Add toast notification
		} catch (error) {
			console.error("Error rating recipe:", error);
			// TODO: Add toast notification
		}
		setLoading(false);
	};

	return (
		<div>
			<h1>Rating</h1>
			<div>
				{Array.from({ length: 5 }, (_, index) => (
					<button
						disabled={loading}
						key={index + 1}
						style={{
							cursor: "pointer",
							color: stars === index + 1 ? "gold" : "black",
						}}
						onClick={() => handleRateRecipe(index + 1)}>
						{index + 1}
					</button>
				))}
			</div>
			<p>Avg rating: {meanRating}</p>
			<p>Your rating: {stars}</p>
		</div>
	);
}

export default RatingComponent;
