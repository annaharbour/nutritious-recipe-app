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

	const [category, setCategory] = useState(ingredientCategories[0]);

	useEffect(() => {
		const fetchIngredients = async (category) => {
			try {
				const res = await getIngredientsByCategory(category);
				const ingredientData = res.data.sort((a, b) => a.description.localeCompare(b.description))
				setIngredients(ingredientData);
			} catch (error) {
				console.error("Error fetching ingredients:", error);
			}
		};

		if (category) {
			fetchIngredients(category);
		}
	}, [category]);

	const handleSearch = async (e) => {
		e.preventDefault();
		try {
			const response = await searchRecipes({
				recipeName,
				userName,
				includeIngredients: includeIngredients.map((ing) => ing._id).join(","),
				excludeIngredients: excludeIngredients.map((ing) => ing._id).join(","),
				optimizations: JSON.stringify(optimizations),
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
		setCategory(ingredientCategories[0]);
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
		<section className="search-recipes">
			<form className="form">
				<h2>Search Recipes</h2>

				<div className="form-group">
					<input
						type="text"
						id="recipeName"
						placeholder="Recipe Keyword"
						value={recipeName}
						onChange={(e) => setRecipeName(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						id="userName"
						placeholder="User Name"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<div className="tabs">
						{ingredientCategories.map((cat) => (
							<button
								type="button"
								key={cat}
								className={`tab-button ${cat === category ? "active" : ""}`}
								onClick={() => setCategory(cat)}
							>
								{cat}
							</button>
						))}
					</div>
					<ul className="ingredients">
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
										}`}
									>
										<i
											className="fa-solid fa-check"
											onClick={() => handleIncludeIngredient(ingredient._id)}
											style={{ cursor: "pointer", marginRight: "10px" }}
										></i>
										<i
											className="fa-solid fa-x"
											onClick={() => handleExcludeIngredient(ingredient._id)}
											style={{ cursor: "pointer", marginRight: "10px" }}
										></i>
										{ingredient.description}
									</span>
								);
							})
						)}
					</ul>
				</div>
				<div className="form-group optimizations">
					<div className="optimization">
						<input
							type="checkbox"
							id="bulking"
							name="bulking"
							checked={optimizations.bulking}
							onChange={handleOptimizationChange}
						/>
						<label htmlFor="bulking">Bulking</label>
					</div>
					<div className="optimization">
						<input
							type="checkbox"
							id="lean"
							name="lean"
							checked={optimizations.lean}
							onChange={handleOptimizationChange}
						/>
						<label htmlFor="lean">Lean</label>
					</div>
					<div className="optimization">
						<input
							type="checkbox"
							id="highProtein"
							name="highProtein"
							checked={optimizations.highProtein}
							onChange={handleOptimizationChange}
						/>
						<label htmlFor="highProtein">High Protein</label>
					</div>
					<div className="optimization">
						<input
							type="checkbox"
							id="lowCarb"
							name="lowCarb"
							checked={optimizations.lowCarb}
							onChange={handleOptimizationChange}
						/>
						<label htmlFor="lowCarb">Low Carb</label>
					</div>
					<div className="optimization">
						<input
							type="checkbox"
							id="lowFat"
							name="lowFat"
							checked={optimizations.lowFat}
							onChange={handleOptimizationChange}
						/>
						<label htmlFor="lowFat">Low Fat</label>
					</div>
				</div>
				<button className="btn" onClick={handleSearch}>Search</button>
				<button className="btn btn-warning" onClick={handleClearCriteria}>Clear All Criteria</button>
			</form>

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
		</section>
	);
};

export default Search;
