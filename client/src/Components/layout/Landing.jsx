import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
					<h1>Harbour Health</h1>
					{formToShow === "register" && (
						<Register showToast={showToast} showForm={showForm} />
					)}
					{formToShow === "login" && (
						<Login showToast={showToast} showForm={showForm} />
					)}
					{!formToShow && (
						<>
							<h2>Time to up your smoothie game</h2>
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
