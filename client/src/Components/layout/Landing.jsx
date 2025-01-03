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
								Discover and create delicious smoothie recipes tailored to your
								nutritional goals and taste preferences!
							</p>
							<p className="nav-header">
								Sign up for Siren Smoothies to create, bookmark, rate, and comment on original recipes 😋
							</p>
							<Link className="landing-links" to="/recipes/search">
								Search Our Recipe Catalog
							</Link>

							<Link className="landing-links" to="/recipes/trending">
								View Trending Recipes
							</Link>
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
