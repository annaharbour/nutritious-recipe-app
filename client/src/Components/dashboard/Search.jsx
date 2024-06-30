// import React, { useState, useEffect } from "react";
// import { searchRecipes } from "../../services/recipeService";
// import { getIngredientsByCategory } from "../../services/ingredientService";

// const Search = ({ showToast }) => {
// 	const [recipeName, setRecipeName] = useState("");
// 	const [userName, setUserName] = useState("");
// 	const [ingredients, setIngredients] = useState([]);
// 	const [includeIngredients, setIncludeIngredients] = useState([]);
// 	const [excludeIngredients, setExcludeIngredients] = useState([]);
// 	const [optimizations, setOptimizations] = useState({
// 		bulking: false,
// 		lean: false,
// 		highProtein: false,
// 		lowCarb: false,
// 		lowFat: false,
// 	});
// 	const [results, setResults] = useState([]);
// 	const ingredientCategories = [
// 		"Fruit",
// 		"Vegetable",
// 		"Protein",
// 		"Nuts & Seeds",
// 		"Liquid",
// 		"Flavor",
// 	];

// 	const labels = [
// 		"Lean",
// 		"Bulking",
// 		"Low Carb",
// 		"High Protein",
// 		"Low Fat",
// 		"Balanced"
// 	]

// 	const [category, setCategory] = useState();

// 	useEffect(() => {
// 		const fetchIngredients = async (category) => {
// 			try {
// 				const res = await getIngredientsByCategory(category);
// 				setIngredients(res.data);
// 			} catch (error) {
// 				console.error("Error fetching ingredients:", error);
// 			}
// 		};

// 		fetchIngredients(category);
// 	}, [category]);

// 	const handleSearch = async () => {
// 		try {
// 			const response = await searchRecipes({
// 				recipeName,
// 				userName,
// 				includeIngredients: includeIngredients.map((ing) => ing._id),
// 				excludeIngredients: excludeIngredients.map((ing) => ing._id),
// 				optimizations,
// 			});
// 			setResults(response);
// 		} catch (err) {
// 			console.error("Error searching recipes:", err);
// 		}
// 	};

// 	const handleIncludeIngredient = (ingredientId) => {
// 		if (ingredientId) {
// 			// Remove the ingredient from excludeIngredients if it exists there
// 			const newExcludeIngredients = excludeIngredients.filter(
// 				(ingredient) => ingredient._id !== ingredientId
// 			);
// 			setExcludeIngredients(newExcludeIngredients);

// 			// Add the ingredient to includeIngredients if it's not already there
// 			if (
// 				!includeIngredients.some(
// 					(ingredient) => ingredient._id === ingredientId
// 				)
// 			) {
// 				const ingredient = ingredients.find((ing) => ing._id === ingredientId);
// 				setIncludeIngredients([...includeIngredients, ingredient]);
// 			}
// 		}
// 	};

// 	const handleExcludeIngredient = (ingredientId) => {
// 		if (ingredientId) {
// 			// Remove the ingredient from includeIngredients if it exists there
// 			const newIncludeIngredients = includeIngredients.filter(
// 				(ingredient) => ingredient._id !== ingredientId
// 			);
// 			setIncludeIngredients(newIncludeIngredients);

// 			// Add the ingredient to excludeIngredients if it's not already there
// 			if (
// 				!excludeIngredients.some(
// 					(ingredient) => ingredient._id === ingredientId
// 				)
// 			) {
// 				const ingredient = ingredients.find((ing) => ing._id === ingredientId);
// 				setExcludeIngredients([...excludeIngredients, ingredient]);
// 			}
// 		}
// 	};

// 	const handleClearCriteria = () => {
// 		setRecipeName("");
// 		setUserName("");
// 		setIncludeIngredients([]);
// 		setExcludeIngredients([]);
// 		setCategory();
// 		setOptimizations({
// 			bulking: false,
// 			lean: false,
// 			highProtein: false,
// 			lowCarb: false,
// 			lowFat: false,
// 		});
// 	};

// 	const handleOptimizationChange = (e) => {
// 		const { name, checked } = e.target;
// 		setOptimizations((prev) => ({
// 			...prev,
// 			[name]: checked,
// 		}));
// 	};

// 	return (
// 		<div>
// 			<h2>Search Recipes</h2>
// 			<div>
// 				<input
// 					placeholder="Search recipes by name"
// 					type="text"
// 					value={recipeName}
// 					onChange={(e) => setRecipeName(e.target.value)}
// 				/>
// 			</div>
// 			<div>
// 				<input
// 					placeholder="Search recipes by user"
// 					type="text"
// 					value={userName}
// 					onChange={(e) => setUserName(e.target.value)}
// 				/>
// 			</div>
// 			<div>
// 				<h3>Ingredients</h3>
// 				{ingredientCategories.map((category) => (
// 					<b
// 						key={category}
// 						value={category}
// 						onClick={(e) => setCategory(category)}>
// 						{category}
// 						{"  "}
// 					</b>
// 				))}
// 				<ul>
// 					{!category ? (
// 						<i>Include or exclude ingredients from each category</i>
// 					) : (
// 						ingredients.map((ingredient) => {
// 							const isIncluded = includeIngredients.some(
// 								(ing) => ing._id === ingredient._id
// 							);
// 							const isExcluded = excludeIngredients.some(
// 								(ing) => ing._id === ingredient._id
// 							);

// 							return (
// 								<span
// 									key={ingredient._id}
// 									className={`ingredient ${isIncluded ? "included" : ""} ${
// 										isExcluded ? "excluded" : ""
// 									}`}>
// 									<i
// 										className="fa-solid fa-check"
// 										onClick={() => handleIncludeIngredient(ingredient._id)}
// 										style={{ cursor: "pointer", marginRight: "10px" }}></i>
// 									<i
// 										className="fa-solid fa-x"
// 										onClick={() => handleExcludeIngredient(ingredient._id)}
// 										style={{ cursor: "pointer", marginRight: "10px" }}></i>
// 									{ingredient.description}
// 								</span>
// 							);
// 						})
// 					)}
// 				</ul>
// 			</div>

// 			<div>
// 				<h3>Optimizations</h3>
// 				<label>
// 					<input
// 						type="checkbox"
// 						name="bulking"
// 						checked={optimizations.bulking}
// 						onChange={handleOptimizationChange}
// 					/>
// 					Bulking (over 400 calories)
// 				</label>
// 				<label>
// 					<input
// 						type="checkbox"
// 						name="lean"
// 						checked={optimizations.lean}
// 						onChange={handleOptimizationChange}
// 					/>
// 					Lean (under 400 calories)
// 				</label>
// 				<label>
// 					<input
// 						type="checkbox"
// 						name="highProtein"
// 						checked={optimizations.highProtein}
// 						onChange={handleOptimizationChange}
// 					/>
// 					High Protein (40% protein)
// 				</label>
// 				<label>
// 					<input
// 						type="checkbox"
// 						name="lowCarb"
// 						checked={optimizations.lowCarb}
// 						onChange={handleOptimizationChange}
// 					/>
// 					Low Carb (under 20g)
// 				</label>
// 				<label>
// 					<input
// 						type="checkbox"
// 						name="lowFat"
// 						checked={optimizations.lowFat}
// 						onChange={handleOptimizationChange}
// 					/>
// 					Low Fat (under 5g)
// 				</label>
// 			</div>

// 			<button onClick={handleSearch}>Search</button>
// 			<button onClick={handleClearCriteria}>Clear All Criteria</button>
// 			<div>
// 				<h3>Results:</h3>
// 				<ul>
// 					{results.length ? (
// 						results.map((recipe) => <li key={recipe._id}>{recipe.name}</li>)
// 					) : (
// 						<div>No results found</div>
// 					)}
// 				</ul>
// 			</div>
// 		</div>
// 	);
// };

// export default Search;
import React, { useState, useEffect } from "react";
import { searchRecipes } from "../../services/recipeService";
import { getIngredientsByCategory } from "../../services/ingredientService";

const Search = ({ showToast }) => {
	const [recipeName, setRecipeName] = useState("");
	const [userName, setUserName] = useState("");
	const [ingredients, setIngredients] = useState([]);
	const [includeIngredients, setIncludeIngredients] = useState([]);
	const [excludeIngredients, setExcludeIngredients] = useState([]);
	const [optimizations, setOptimizations] = useState({
		bulking: false,
		lean: false,
		highProtein: false,
		lowCarb: false,
		lowFat: false,
	});
	const [results, setResults] = useState([]);
	const ingredientCategories = [
		"Fruit",
		"Vegetable",
		"Protein",
		"Nuts & Seeds",
		"Liquid",
		"Flavor",
	];

	const [category, setCategory] = useState();

	useEffect(() => {
		const fetchIngredients = async (category) => {
			try {
				const res = await getIngredientsByCategory(category);
				setIngredients(res.data);
			} catch (error) {
				console.error("Error fetching ingredients:", error);
			}
		};

		if (category) {
			fetchIngredients(category);
		}
	}, [category]);

	const handleSearch = async () => {
		try {
			const response = await searchRecipes({
				recipeName,
				userName,
				includeIngredients: includeIngredients.map((ing) => ing._id).join(","),
				excludeIngredients: excludeIngredients.map((ing) => ing._id).join(","),
				optimizations: JSON.stringify(optimizations), // Convert optimizations object to JSON string
			});
			setResults(response);
		} catch (err) {
			console.error("Error searching recipes:", err);
		}
	};

	const handleIncludeIngredient = (ingredientId) => {
		if (ingredientId) {
			const newExcludeIngredients = excludeIngredients.filter(
				(ingredient) => ingredient._id !== ingredientId
			);
			setExcludeIngredients(newExcludeIngredients);

			if (
				!includeIngredients.some(
					(ingredient) => ingredient._id === ingredientId
				)
			) {
				const ingredient = ingredients.find((ing) => ing._id === ingredientId);
				setIncludeIngredients([...includeIngredients, ingredient]);
			}
		}
	};

	const handleExcludeIngredient = (ingredientId) => {
		if (ingredientId) {
			const newIncludeIngredients = includeIngredients.filter(
				(ingredient) => ingredient._id !== ingredientId
			);
			setIncludeIngredients(newIncludeIngredients);

			if (
				!excludeIngredients.some(
					(ingredient) => ingredient._id === ingredientId
				)
			) {
				const ingredient = ingredients.find((ing) => ing._id === ingredientId);
				setExcludeIngredients([...excludeIngredients, ingredient]);
			}
		}
	};

	const handleClearCriteria = () => {
		setRecipeName("");
		setUserName("");
		setIncludeIngredients([]);
		setExcludeIngredients([]);
		setCategory(null);
		setOptimizations({
			bulking: false,
			lean: false,
			highProtein: false,
			lowCarb: false,
			lowFat: false,
		});
	};

	const handleOptimizationChange = (e) => {
		const { name, checked } = e.target;
		setOptimizations((prev) => ({
			...prev,
			[name]: checked,
		}));
	};

	return (
		<div>
			<h2>Search Recipes</h2>
			<div>
				<input
					placeholder="Search recipes by name"
					type="text"
					value={recipeName}
					onChange={(e) => setRecipeName(e.target.value)}
				/>
			</div>
			<div>
				<input
					placeholder="Search recipes by user"
					type="text"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>
			</div>
			<div>
				<h3>Ingredients</h3>
				{ingredientCategories.map((category) => (
					<b
						key={category}
						value={category}
						onClick={() => setCategory(category)}>
						{category}
						{"  "}
					</b>
				))}
				<ul>
					{!category ? (
						<i>Include or exclude ingredients from each category</i>
					) : (
						ingredients.map((ingredient) => {
							const isIncluded = includeIngredients.some(
								(ing) => ing._id === ingredient._id
							);
							const isExcluded = excludeIngredients.some(
								(ing) => ing._id === ingredient._id
							);

							return (
								<span
									key={ingredient._id}
									className={`ingredient ${isIncluded ? "included" : ""} ${
										isExcluded ? "excluded" : ""
									}`}>
									<i
										className="fa-solid fa-check"
										onClick={() => handleIncludeIngredient(ingredient._id)}
										style={{ cursor: "pointer", marginRight: "10px" }}></i>
									<i
										className="fa-solid fa-x"
										onClick={() => handleExcludeIngredient(ingredient._id)}
										style={{ cursor: "pointer", marginRight: "10px" }}></i>
									{ingredient.description}
								</span>
							);
						})
					)}
				</ul>
			</div>

			<div>
				<h3>Optimizations</h3>
				<label>
					<input
						type="checkbox"
						name="bulking"
						checked={optimizations.bulking}
						onChange={handleOptimizationChange}
					/>
					Bulking (over 400 calories)
				</label>
				<label>
					<input
						type="checkbox"
						name="lean"
						checked={optimizations.lean}
						onChange={handleOptimizationChange}
					/>
					Lean (under 400 calories)
				</label>
				<label>
					<input
						type="checkbox"
						name="highProtein"
						checked={optimizations.highProtein}
						onChange={handleOptimizationChange}
					/>
					High Protein (40% protein)
				</label>
				<label>
					<input
						type="checkbox"
						name="lowCarb"
						checked={optimizations.lowCarb}
						onChange={handleOptimizationChange}
					/>
					Low Carb (under 20g)
				</label>
				<label>
					<input
						type="checkbox"
						name="lowFat"
						checked={optimizations.lowFat}
						onChange={handleOptimizationChange}
					/>
					Low Fat (under 5g)
				</label>
			</div>

			<button onClick={handleSearch}>Search</button>
			<button onClick={handleClearCriteria}>Clear All Criteria</button>
			<div>
				<h3>Results:</h3>
				<ul>
					{results && results.length > 0 ? (
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
