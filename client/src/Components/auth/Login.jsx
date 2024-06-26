import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { authURL } from "../../services/endpoints";

const Login = ({ showToast }) => {
	const navigate = useNavigate();
	const { loginUser, userInfo } = useAuth();
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
		} catch (err) {
			showToast(
				err.message,
				"error" || "Unable to log in. Please verify your email and password.",
				"error"
			);
		}
	};

	return userInfo ? (
		<Navigate to="/dashboard" />
	) : (
		<section className="container">
			<h1 className="large text-primary">Sign In</h1>
			<p className="lead">
				<i className="fas fa-user"></i> Sign into Your Account
			</p>
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
			<p className="my-1">
				Don't have an account? <Link to="/register">Sign Up</Link>
			</p>
			<p className="my-1">
				<Link to={`${authURL}/google`}>Sign In Using Google</Link>
			</p>
			<p className="my-1">
				<Link to="/forgotten">Forgot Password?</Link>{" "}
			</p>
		</section>
	);
};

export default Login;
