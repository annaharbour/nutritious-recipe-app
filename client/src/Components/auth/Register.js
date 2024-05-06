import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Register = () => {
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
		if (password !== password2) {
      // TODO: Add a toast message to display the error message
      alert("Passwords do not match")
		} else {
			try {
				await registerUser(name, email, phone, password);
				navigate("/dashboard");
			} catch (error) {
        // TODO: Add a toast message to display the error message
				console.error(error);
			}
		}
	};

	return (
		<section className="container">
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead">
				<i className="fas fa-user" /> Create Your Account
			</p>
			<form className="form" onSubmit={onSubmit}>
				<div className="form-group">
					<input
						type="text"
						placeholder="Name"
						name="name"
						value={name}
						onChange={onChange}
					/>
				</div>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						value={email}
						onChange={onChange}
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						placeholder="Phone Number"
						name="phone"
						value={phone}
						onChange={onChange}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						value={password}
						onChange={onChange}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Confirm Password"
						name="password2"
						value={password2}
						onChange={onChange}
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Register" />
			</form>
			<p className="my-1">
				Already have an account? <Link to="/login">Sign In</Link>
			</p>
		</section>
	);
};

export default Register;
