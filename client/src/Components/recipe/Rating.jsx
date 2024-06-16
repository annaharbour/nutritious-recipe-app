import React, { useState, useEffect } from "react";
import { rateRecipe, getUserRating } from "../../services/recipeService";

function RatingComponent({ recipe }) {
    const [loading, setLoading] = useState(false);
    const [userRating, setUserRating] = useState(null);

    useEffect(() => {
        const fetchUserRating = async () => {
            try {
                const res = await getUserRating(recipe._id);
                if (res) {
                    setUserRating(res.userRating);
                }
            } catch (error) {
                console.error("Error fetching user rating:", error);
            }
        };
        fetchUserRating();
    }, [recipe._id]);

    const handleRateRecipe = async (numStars) => {
        setLoading(true);
        try {
            const res = await rateRecipe(recipe._id, numStars);
            setUserRating(res.userRating);
            alert("Rating submitted");
        } catch (error) {
            console.error("Error rating recipe:", error);
            alert("Error rating recipe");
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
                        style={{ cursor: 'pointer', color: userRating === index + 1 ? 'gold' : 'black' }}
                        onClick={() => handleRateRecipe(index + 1)
                        }
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <p>Avg rating: {recipe.meanRating}</p>
        </div>
    );
}

export default RatingComponent;
