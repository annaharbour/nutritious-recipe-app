import React, { useState } from "react";
import { resetPassword } from "../../services/authService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Reset({ showToast }) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { token } = useParams();
	const navigate = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			showToast("Passwords do not match", "error");
			return;
		}
		try {
			await resetPassword(token, password);
			showToast("Password has been reset successfully", "success");
			navigate("/");
		} catch (error) {
			showToast("Failed to reset password. Please try again.", "error");
		}
	};

	return (
		<section className="landing">
			<div className="dark-overlay">
				<div className="landing-inner">
					<h2>Reset Password</h2>
					<form className="form" onSubmit={onSubmit}>
						<input
							type="password"
							placeholder="New Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						<button className="btn btn-primary" type="submit">
							Reset Password
						</button>
					</form>
				</div>
			</div>
		</section>
	);
}

export default Reset;
