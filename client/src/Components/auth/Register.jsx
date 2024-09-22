import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { authURL } from "../../services/endpoints";

const Register = ({ showToast, showForm }) => {
	const registerUser = useAuth().registerUser;
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		password2: "",
	});

	const { name, email, phone, password, password2 } = formData;

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
	
		if (password !== password2) {
			showToast("Passwords do not match", "error");
		} else if (!regex.test(password)) { 
			showToast("Password should be at least 8 characters and contain at least one uppercase, one lowercase letter, and one number", "error");
		} else {
			try {
				await registerUser(name, email, phone, password);
				navigate("/dashboard");
			} catch (err) {
				showToast(
					err.message || "Registration failed. Please try again.",
					"error"
				);
			}
		}
	};
	
	return (
		<section className="container">
			<h4 className="lead">
				<i className="fas fa-user" /> Create Your Account
			</h4>
			<form className="form" onSubmit={onSubmit}>
				<div className="form-group">
					<input
						type="text"
						placeholder="Name"
						name="name"
						value={name}
						onChange={onChange}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						value={email}
						onChange={onChange}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						placeholder="Phone Number"
						name="phone"
						value={phone}
						onChange={onChange}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						value={password}
						onChange={onChange}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Confirm Password"
						name="password2"
						value={password2}
						onChange={onChange}
						required
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Register" />
			</form>
			<a className="landing-links" href={`${authURL}/google`}>Sign Up With Google</a>
			<p>
				<span onClick={() => showForm("login")}>
					Already have an account? <u>Login here!</u>
				</span>
			</p>
		</section>
	);
};

export default Register;
