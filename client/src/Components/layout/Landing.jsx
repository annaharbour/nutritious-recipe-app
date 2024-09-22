import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { useAuth } from "../auth/AuthContext";

const Landing = ({ showToast }) => {
	const [formToShow, setFormToShow] = useState(null);
	const navigate = useNavigate();
	const showForm = (formType) => {
		setFormToShow(formType);
	};
	const { isLoggedIn } = useAuth();

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/dashboard");
		}
	}, [isLoggedIn, navigate]);

	// return (
	// 	<section className="landing">
	// 		<div className="dark-overlay">
	// 			<div className="landing-inner">
	// 				<h1>Siren Smoothies</h1>
	// 				{formToShow === "register" && (
	// 					<Register showToast={showToast} showForm={showForm} />
	// 				)}
	// 				{formToShow === "login" && (
	// 					<Login showToast={showToast} showForm={showForm} />
	// 				)}
	// 				{!formToShow && (
	// 					<>
	// 						<h5>Personalized Smoothie Recipes</h5>
	// 						<div className="buttons">
	// 							<button
	// 								onClick={() => showForm("register")}
	// 								className="btn btn-light">
	// 								Sign Up
	// 							</button>
	// 							<button
	// 								onClick={() => showForm("login")}
	// 								className="btn btn-light">
	// 								Login
	// 							</button>
	// 						</div>
	// 						<Link to='/recipes/search'>Search Our Recipe Catalog!</Link>
	// 						<Link to='/recipes/trending'>See Trending Recipes!</Link>
	// 					</>
	// 				)}
	// 			</div>
	// 		</div>
	// 	</section>
	// );
	return (
		<section className="landing">
			<div className="dark-overlay">
				<div className="landing-inner">
					<h1>Welcome to Siren Smoothies</h1>
					{formToShow === "register" && (
						<Register showToast={showToast} showForm={showForm} />
					)}
					{formToShow === "login" && (
						<Login showToast={showToast} showForm={showForm} />
					)}
					{!formToShow && (
						<>
							<p>
								Discover delicious smoothie recipes tailored
								to your nutritional goals and taste preferences!
							</p>
							<Link className="landing-links" to="/recipes/search">
								Search Our  Recipe Catalog
							</Link>
							 
							<Link className="landing-links" to="/recipes/trending">
								Check Out Trending Recipes
							</Link>
							
							<p>Ready to bookmark recipes, create your own, and engage in our community by rating and commenting?</p>
							<div className="buttons">
								<button
									onClick={() => showForm("register")}
									className="btn btn-light">
									Sign Up
								</button>
								<button
									onClick={() => showForm("login")}
									className="btn btn-light">
									Login
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</section>
	);
};

export default Landing;
