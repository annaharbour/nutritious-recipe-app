import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchRecipes } from "../../services/recipeService";
import { getIngredientsByCategory } from "../../services/ingredientService";

const Search = ({ showToast }) => {
	const [loading, setLoading] = useState(false);
	const [recipeName, setRecipeName] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

	const toggleDropdown = () => {
		setIsDropdownOpen((prev) => !prev);
	};

	const [category, setCategory] = useState(ingredientCategories[0]);

	useEffect(() => {
		const fetchIngredients = async (category) => {
			try {
				const res = await getIngredientsByCategory(category);
				const ingredientData = res.data.sort((a, b) =>
					a.description.localeCompare(b.description)
				);
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
			setLoading(true);
			const response = await searchRecipes({
				recipeName,
				userName,
				includeIngredients: includeIngredients.map((ing) => ing._id).join(","),
				excludeIngredients: excludeIngredients.map((ing) => ing._id).join(","),
				optimizations: JSON.stringify(optimizations),
			});
			setResults(response);
			setLoading(false);
		} catch (err) {
			console.error("Error searching recipes:", err);
		}
	};

	const handleDeselectIngredient = (ingredientId) => {
		setIncludeIngredients((prev) =>
			prev.filter((ing) => ing._id !== ingredientId)
		);
		setExcludeIngredients((prev) =>
			prev.filter((ing) => ing._id !== ingredientId)
		);
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
				<h4>
					<u>Search by Name</u>
				</h4>
				<div className="form-group name-search">
					<input
						type="text"
						id="recipeName"
						placeholder="Recipe Keyword"
						value={recipeName}
						onChange={(e) => setRecipeName(e.target.value)}
					/>
					<input
						type="text"
						id="userName"
						placeholder="User Name"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<h4
						type="button"
						className="dropdown-toggle-btn"
						onClick={toggleDropdown}>
						<u>Include or Exclude Ingredients</u>
						<i
							className={
								!isDropdownOpen ? `fa fa-caret-down` : "fa fa-caret-up"
							}></i>
					</h4>
				</div>
				{isDropdownOpen && (
					<div className="form-group">
						<div className="tabs">
							{ingredientCategories.map((cat) => (
								<button
									type="button"
									key={cat}
									className={`tab-button ${cat === category ? "active" : ""}`}
									onClick={() => setCategory(cat)}>
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
											}`}>
											<i
												className={`fa-solid fa-check `}
												style={!isIncluded ? { color: "#7cb518" } : {}}
												onClick={() =>
													isIncluded
														? handleDeselectIngredient(ingredient._id)
														: handleIncludeIngredient(ingredient._id)
												}></i>
											<i
												className={`fa-solid fa-x`}
												style={!isExcluded ? { color: "#ff5400ff" } : {}}
												onClick={() =>
													isExcluded
														? handleDeselectIngredient(ingredient._id)
														: handleExcludeIngredient(ingredient._id)
												}></i>
											<span className={`${isExcluded && "strike-through"}`}>
												{ingredient.description}
											</span>
										</span>
									);
								})
							)}
						</ul>
					</div>
				)}
				<h4>
					<u>Optimizations</u>
				</h4>

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
				<button className="btn" onClick={handleSearch}>
					Search
				</button>
				<button className="btn btn-warning" onClick={handleClearCriteria}>
					Clear All Criteria
				</button>
			</form>

			<div className="recipes">
				<h3>Results:</h3>

				<ul className="recipe-list">
					{loading && <i className="fa fa-spinner spinner"></i>}
					{results && results.length > 0 ? (
						results.map((recipe) => (
							<li key={recipe._id}>
								<Link to={`/recipes/${recipe._id}`} key={recipe._id}>
									{recipe.name}
								</Link>
								<div className="recipe labels">
									{recipe.labels.map((label) => (
										<span
											key={label}
											className={`label ${label
												.toLowerCase()
												.replace(/\s+/g, "-")}`}>
											{label}
										</span>
									))}
								</div>
								<span>Serves {recipe.servings}</span>
							</li>
						))
					) : (
						<div>No results found</div>
					)}
				</ul>
			</div>
		</section>
	);
};

export default Search;
