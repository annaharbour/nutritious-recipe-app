import React, {useState} from 'react'
import { saveRecipe } from '../../services/recipeService'

function SaveRecipe({recipe, loading, error, setError, setLoading}) {
    const handleSave = async () => {
		try {
			setLoading(true);
			await saveRecipe(recipe);
			setLoading(false);
			alert("Recipe saved successfully!");
		} catch (err) {
			setError("Failed to save recipe. Please try again later.");
			setLoading(false);
		}
	};
  return (
    <div>
        {
            loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <button onClick={handleSave}>Save Recipe</button>
            )
        }
        
    </div>
  )
}

export default SaveRecipe