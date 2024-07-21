import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { getRating, rateRecipe } from "../../services/ratingService";

function RatingComponent({ recipe, showToast }) {
	const userInfo = useAuth().userInfo;
	const userId = userInfo._id;
	const [loading, setLoading] = useState(false);
	const [stars, setStars] = useState(null);
	const [meanRating, setMeanRating] = useState(null);

	useEffect(() => {
		const fetchRating = async () => {
			try {
				const res = await getRating(recipe._id);
				res.meanRating && setMeanRating(res.meanRating);
				res.userRating && setStars(res.userRating);
			} catch (error) {
				console.error("Error fetching user rating:", error);
			}
		};

		fetchRating();
	}, [recipe, userId]);

	const handleRateRecipe = async (stars) => {
		setLoading(true);
		try {
			const res = await rateRecipe(recipe._id, stars);
			if (res.userRating && res.userRating !== null) {
				setStars(res.userRating);
			}
			showToast("Rating submitted", "success");
		} catch (error) {
			console.error("Error rating recipe:", error);
			showToast("Error rating recipe", "error");
		}
		setLoading(false);
	};

	return (
		<div>
			{meanRating === null ? (
				<div>
					{Array.from({ length: 5 }, (_, index) => (
						<i
							className="fa-solid fa-star"
							disabled={loading}
							key={index + 1}
							style={{
								cursor: "pointer",
								color: stars === index + 1 ? "gold" : "#F9F6EE",
							}}
							onClick={() => handleRateRecipe(index + 1)}></i>
					))}
				</div>
			) : (
				Array.from({ length: 5 }, (_, index) => (
					<i
						className="fa-solid fa-star"
						disabled={loading}
						key={index + 1}
						style={{
							cursor: "pointer",
							color: meanRating >= index + 1 ? "gold" : "#F9F6EE",
							fontSize: stars === index + 1 ? "2rem" : "1.5rem",
						}}
					/>
				))
			)}
		</div>
	);
}

export default RatingComponent;
