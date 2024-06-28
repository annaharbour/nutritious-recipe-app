import React, { useState, useEffect } from "react";
import { searchRecipes } from "../../services/recipeService";
import { getIngredients } from "../../services/ingredientService";
import { getNutrients } from "../../services/nutrientService";

const Search = () => {
	const [recipeName, setRecipeName] = useState("");
	const [userName, setUserName] = useState("");
	const [allNutrients, setAllNutrients] = useState([]);
	const [nutrients, setNutrients] = useState([]);
	const [selectedNutrient, setSelectedNutrient] = useState({
		_id: "",
		name: "",
		unit: "",
		order: "asc", // Default to ascending order
	});
	const [ingredients, setIngredients] = useState([]);
	const [selectedIngredient, setSelectedIngredient] = useState("");
	const [includeIngredients, setIncludeIngredients] = useState([]);
	const [excludeIngredients, setExcludeIngredients] = useState([]);
	const [sortCriteria, setSortCriteria] = useState([]);
	const [results, setResults] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchIngredients = async () => {
			try {
				const res = await getIngredients();
				setIngredients(res.data);
			} catch (err) {
				setError(err.response ? err.response.data.error : "An error occurred");
			}
		};

		const fetchNutrients = async () => {
			try {
				const res = await getNutrients();
				setAllNutrients(res.data);
			} catch (err) {
				setError(err.response ? err.response.data.error : "An error occurred");
			}
		};
		fetchNutrients();
		fetchIngredients();
	}, []);

	const handleSearch = async () => {
		try {
			const response = await searchRecipes({
				recipeName,
				userName,
				nutrients,
				includeIngredients,
				excludeIngredients,
				sortCriteria,
			});
			setResults(response);
			setError("");
		} catch (err) {
			setError(err.response ? err.response.data.error : "An error occurred");
		}
	};

	const handleAddNutrient = () => {
		setNutrients([...nutrients, selectedNutrient]);
		setSelectedNutrient({
			_id: "",
			name: "",
			unit: "",
			order: "asc",
		});
	};

	const handleIncludeIngredient = () => {
		if (
			selectedIngredient &&
			!includeIngredients.some(
				(ingredient) => ingredient._id === selectedIngredient._id
			)
		) {
			const ingredient = ingredients.find(
				(ing) => ing._id === selectedIngredient
			);
			setIncludeIngredients([...includeIngredients, ingredient]);
		}
	};

	const handleExcludeIngredient = () => {
		if (
			selectedIngredient &&
			!excludeIngredients.some(
				(ingredient) => ingredient._id === selectedIngredient._id
			)
		) {
			const ingredient = ingredients.find(
				(ing) => ing._id === selectedIngredient
			);
			setExcludeIngredients([...excludeIngredients, ingredient]);
		}
	};

	const handleRemoveIncludeIngredient = (id) => {
		setIncludeIngredients(includeIngredients.filter((ing) => ing._id !== id));
	};

	const handleRemoveExcludeIngredient = (id) => {
		setExcludeIngredients(excludeIngredients.filter((ing) => ing._id !== id));
	};

	const handleRemoveNutrient = (id) => {
		setNutrients(nutrients.filter((nutrient) => nutrient._id !== id));
	};

	const handleClearCriteria = () => {
		setRecipeName("");
		setUserName("");
		setIncludeIngredients([]);
		setExcludeIngredients([]);
		setNutrients([]);
		setSortCriteria([]);
	};

	const handleNutrientChange = (e) => {
		const nutrient = allNutrients.find((n) => n._id === e.target.value);
		setSelectedNutrient({ ...nutrient, order: "asc" });
	};

	return (
		<div>
			<h2>Search Recipes</h2>
			<div>
				<label>Recipe Name:</label>
				<input
					type="text"
					value={recipeName}
					onChange={(e) => setRecipeName(e.target.value)}
				/>
			</div>
			<div>
				<label>User Name:</label>
				<input
					type="text"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>
			</div>
			<div>
				<label>Ingredients</label>
				<select
					value={selectedIngredient || ""}
					onChange={(e) => setSelectedIngredient(e.target.value)}>
					<option value="">Select an ingredient</option>
					{ingredients &&
						ingredients.map((ingredient) => (
							<option key={ingredient._id} value={ingredient._id}>
								{ingredient.description}
							</option>
						))}
				</select>
				<button onClick={handleIncludeIngredient}>Include</button>
				<button onClick={handleExcludeIngredient}>Exclude</button>
			</div>
			{includeIngredients.length > 0 && (
				<div>
					<h3>Included Ingredients</h3>
					<ul>
						{includeIngredients.map((ingredient) => (
							<li key={ingredient._id}>
								{ingredient.description}{" "}
								<button
									onClick={() => handleRemoveIncludeIngredient(ingredient._id)}>
									Remove
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
			{excludeIngredients.length > 0 && (
				<div>
					<h3>Excluded Ingredients</h3>
					<ul>
						{excludeIngredients.map((ingredient) => (
							<li key={ingredient._id}>
								{ingredient.description}{" "}
								<button
									onClick={() => handleRemoveExcludeIngredient(ingredient._id)}>
									Remove
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			<div>
				<h3>Nutrients</h3>
				<select
					value={selectedNutrient.order}
					onChange={(e) =>
						setSelectedNutrient({
							...selectedNutrient,
							order: e.target.value,
						})
					}>
					<option value="asc">Lowest Amount</option>
					<option value="desc">Highest Amount</option>
				</select>
				<select
					value={selectedNutrient._id || ""}
					onChange={handleNutrientChange}>
					<option value="">Select a nutrient</option>
					{allNutrients &&
						allNutrients.map((nutrient) => (
							<option key={nutrient._id} value={nutrient._id}>
								{nutrient.name}
							</option>
						))}
				</select>
				<button onClick={handleAddNutrient}>Include</button>
			</div>
			<div>
				<h3>Selected Nutrients</h3>
				<ul>
					{nutrients.map((nutrient) => (
						<li key={nutrient._id}>
							{nutrient.name} ({nutrient.order}){" "}
							<button onClick={() => handleRemoveNutrient(nutrient._id)}>
								Remove
							</button>
						</li>
					))}
				</ul>
			</div>
			<button onClick={handleSearch}>Search</button>
			<button onClick={handleClearCriteria}>Clear All Criteria</button>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<div>
				<h3>Results:</h3>
				<ul>
					{results ? (
						results.map((recipe) => <li key={recipe._id}>{recipe.name}</li>)
					) : (
						<div>No results found</div>
					)}
				</ul>
			</div>
		</div>
	);
};

export default Search;
