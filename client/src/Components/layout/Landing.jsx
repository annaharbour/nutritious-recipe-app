import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";

const Landing = ({ isLoggedIn, showToast }) => {
	const [formToShow, setFormToShow] = useState(null);

	const showForm = (formType) => {
		setFormToShow(formType);
	};

	return isLoggedIn ? (
		<Navigate to="/" />
	) : (
		<section className="landing">
			<div className="dark-overlay">
				<div className="landing-inner">
					<h1>Harbour Health</h1>
					{formToShow === "register" && <Register showToast={showToast} showForm={showForm} />}
					{formToShow === "login" && <Login showToast={showToast} showForm={showForm} />}
					{!formToShow && (
						<>
							<p>Time to up your smoothie game</p>
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
