import React from 'react'
import { rateRecipe } from '../../services/recipeService';

function Rating({recipe}) {
    const handleRateRecipe = async (recipe, numStars) => {
        const res = await rateRecipe(recipe, numStars);
        console.log(res);
    }
  return (
    <div>
        <h1>Rating</h1>
        <li value="1" onClick={(e => handleRateRecipe(recipe._id, e.target.value))}>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <p>Avg rating: {recipe.rating}</p> 
    </div>
  )
}

export default Rating