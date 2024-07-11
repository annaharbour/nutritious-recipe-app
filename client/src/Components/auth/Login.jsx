import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { authURL } from "../../services/endpoints";
import Dashboard from "../dashboard/Dashboard";
import Forgotten from "./Forgotten";

const Login = ({ showToast, showForm }) => {
	const navigate = useNavigate();
	const { loginUser, userInfo } = useAuth();
	const [forgotten, showForgotten] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	useEffect(() => {
		if (userInfo) {
			navigate("/dashboard");
		}
	}, [userInfo, navigate]);

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			await loginUser(email, password);
			navigate("/dashboard");
			return;
		} catch (err) {
			showToast(
				err.message,
				"error" || "Unable to log in. Please verify your email and password.",
				"error"
			);
		}
	};

	return userInfo ? (
		<Dashboard />
	) : !forgotten ? (
		<div>
			{" "}
			<section className="container">
				<h4>
					<i className="fas fa-user"></i> Sign into Your Account
				</h4>
				<form className="form" onSubmit={(e) => onSubmit(e)}>
					<div className="form-group">
						<input
							type="email"
							placeholder="Email Address"
							name="email"
							value={email}
							onChange={(e) => onChange(e)}
							required
						/>
					</div>
					<div className="form-group">
						<input
							type="password"
							placeholder="Password"
							name="password"
							value={password}
							onChange={(e) => onChange(e)}
						/>
					</div>
					<input type="submit" className="btn btn-primary" value="Login" />
				</form>
				<a href={`${authURL}/google`}>Sign Up With Google</a>
				<p>
					<span onClick={() => showForm("register")}>
						Don't have an account? <u>Sign Up!</u>
					</span>
				</p>
				<p>
					Forgot your password? <span onClick={() => showForgotten("forgotten")}>Reset it here!</span>
				</p>
			</section>
		</div>
	) : (
		<Forgotten showToast={showToast} showForgotten={showForgotten} />
	);
};

export default Login;
