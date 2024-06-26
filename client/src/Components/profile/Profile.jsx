import React, { useState, useEffect } from "react";
import { getUser, updateUser, deleteUser } from "../../services/userService";

function Profile({ showToast }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [userInfo, setUserInfo] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	const [changePw, setChangePw] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		newPassword: "",
		newPassword2: "",
	});
	const { name, email, phone, password, newPassword, newPassword2 } = formData;

	useEffect(() => {
		const fetchProfileInfo = async () => {
			try {
				setLoading(true);
				let response = await getUser();
				setUserInfo(response);
				const { name, email, phone } = response;
				setFormData({
					name,
					email,
					phone,
					password: "",
					newPassword: "",
					newPassword2: "",
				});
				setLoading(false);
			} catch (error) {
				setError("Failed to fetch data. Please try again later.");
				setLoading(false);
			}
		};

		fetchProfileInfo();
	}, []);

	const deleteAccount = async () => {
		if (window.confirm("Are you sure you want to delete your account?")) {
			try {
				const res = await deleteUser(userInfo._id);
				console.log(res.data);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		if (changePw) {
			if (newPassword !== newPassword2) {
				showToast("Passwords do not match", "error");
				return;
			}
		}
		try {
			const res = await updateUser(
				name,
				email,
				phone,
				password,
				changePw ? newPassword : null
			);

			if (res) {
				showToast("Profile updated successfully", "success");
				setIsEditing(false);
			} else {
				showToast("Update failed. Please try again.", "error");
			}
		} catch (error) {
			console.log(error);
			showToast(
				error.message || "Update failed. Please try again.",
				"error",
				"error"
			);
		}
	};

	return (
		<div>
			{isEditing ? (
				<div>
					{loading ? (
						<div>Loading...</div>
					) : (
						<div>
							<h1>{userInfo.name}</h1>
							<section className="container">
								<h1 className="large text-primary">Change Account Details</h1>
								<p className="lead">
									<i className="fas fa-user" /> Update Your Information
								</p>
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
											required
											type="password"
											placeholder="Password"
											name="password"
											value={password}
											onChange={onChange}
										/>
										<i onClick={() => setChangePw(!changePw)}>
											{!changePw ? (
												<i className="fa-solid fa-lock"></i>
											) : (
												<i className="fa-solid fa-lock-open"></i>
											)}{" "}
											Update password?{" "}
										</i>
										{changePw && (
											<>
												<h4>
													<i className="fa-solid fa-key"></i>Change your
													password
												</h4>
												<div className="form-group">
													<input
														type="password"
														placeholder="New Password"
														name="newPassword"
														value={newPassword}
														onChange={onChange}
														required
													/>
												</div>
												<div className="form-group">
													<input
														type="password"
														placeholder="Confirm Password"
														name="newPassword2"
														value={newPassword2}
														onChange={onChange}
														required
													/>
												</div>
											</>
										)}
									</div>
									<input
										type="submit"
										className="btn btn-primary"
										value="Update"
									/>
								</form>
							</section>
						</div>
					)}
					{error && <div>{error}</div>}
					<button onClick={() => setIsEditing(false)}>Cancel</button>
					<button onClick={deleteAccount}>Delete Account</button>
				</div>
			) : (
				<>
					<h2>Edit Account Details</h2>
					<button onClick={() => setIsEditing(true)}>
						<i className="fa-solid fa-pencil"></i>
					</button>
				</>
			)}
		</div>
	);
}

export default Profile;
