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

	const handleRateRecipe = async (newStars) => {
		setLoading(true);
		try {
			const res = await rateRecipe(recipe._id, newStars);
			if (res.userRating && res.userRating !== null) {
				setStars(res.userRating);
				setMeanRating(res.meanRating);
				console.log(meanRating)
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
			{Array.from({ length: 5 }, (_, index) => {
				const starIndex = index + 1;
				const isUserRating = stars === starIndex;
				const isMeanRatingOrBelow = meanRating >= starIndex;

				return (
					<i
						className="fa-solid fa-star"
						disabled={loading}
						key={starIndex}
						style={{
							cursor: loading ? "not-allowed" : "pointer",
							color: isMeanRatingOrBelow ? "gold" : "#F9F6EE",
							fontSize: isUserRating ? "2rem" : "1.5rem",
						}}
						onClick={() => !loading && handleRateRecipe(starIndex)}
					/>
				);
			})}
		</div>
	);
}

export default RatingComponent;
