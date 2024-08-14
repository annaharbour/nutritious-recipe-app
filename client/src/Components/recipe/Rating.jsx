import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { getRating, rateRecipe } from "../../services/ratingService";

function RatingComponent({ recipe, showToast }) {
	const userInfo = useAuth().userInfo;
	const userId = userInfo ? userInfo._id : null;
	const [loading, setLoading] = useState(false);
	const [stars, setStars] = useState(null);
	const [meanRating, setMeanRating] = useState(null);
	const [hoveredStar, setHoveredStar] = useState(null); 

	useEffect(() => {
		console.log(userId)
		const fetchRating = async () => {
			try {
				const res = await getRating(recipe._id);
				if (res.meanRating) setMeanRating(res.meanRating);
				if (res.userRating) setStars(res.userRating);
			} catch (error) {
				console.error("Error fetching user rating:", "error");
			}
		};

		fetchRating();
	}, [recipe._id, userId]);

	const handleRateRecipe = async (newStars) => {
		setLoading(true);
		try {
			const res = await rateRecipe(recipe._id, newStars);
			if (res.userRating !== null) {
				setStars(res.userRating);
				setMeanRating(res.meanRating);
			}
			showToast("Rating submitted", "success");
		} catch (error) {
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
				const isHovered = hoveredStar === starIndex;

				return (
					<i
						className="fa-solid fa-star"
						disabled={loading}
						key={starIndex}
						style={{
							cursor: loading ? "not-allowed" : "pointer",
							color: isMeanRatingOrBelow || isHovered ? "gold" : "#F9F6EE",
							fontSize: isHovered || isUserRating ? "2rem" : "1.5rem",
							transition: 'font-size 0.3s ease',
						}}
						onMouseEnter={() => setHoveredStar(starIndex)}
						onMouseLeave={() => setHoveredStar(null)}
						onClick={() => !loading && handleRateRecipe(starIndex)}
					/>
				);
			})}
		</div>
	);
}

export default RatingComponent;
