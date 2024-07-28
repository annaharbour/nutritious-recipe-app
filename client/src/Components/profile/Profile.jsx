import React, { useState, useEffect } from "react";
import { getUser, updateUser, deleteUser } from "../../services/userService";
import { useNavigate } from "react-router";

function Profile({ showToast }) {
	const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({});
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
                console.log(response);
                setUserInfo(response);
                const { name, email, phone } = response;
                setFormData({
                    name: name || "",
                    email: email || "",
                    phone: phone || "",
                    password: "",
                    newPassword: "",
                    newPassword2: "",
                });
                setLoading(false);
            } catch (error) {
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
            await updateUser(
                name,
                email,
                phone,
                password || null,
                changePw ? newPassword : null
            );

            showToast("Profile updated successfully", "success");
			navigate('/dashboard')
        } catch (error) {
            showToast("Update failed. Please try again.", "error");
        }
    };

    return (
        <div className="account">
            <section className="container">
                <h3 className="large text-primary">Change Account Details</h3>
                <h3>{userInfo.name}</h3>
                <h4>
                    <i className="fas fa-user" /> Update Your Information
                </h4>
                <form className="form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={name || ""}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email || ""}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Phone Number"
                            name="phone"
                            value={phone || ""}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        {userInfo.oAuthProvider && !userInfo.hasPassword ? null : (
                            <input
                                required
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password || ""}
                                onChange={onChange}
                            />
                        )}
                        <i onClick={() => setChangePw(!changePw)}>
                            {!changePw ? (
                                <i className="fa-solid fa-lock"></i>
                            ) : (
                                <i className="fa-solid fa-lock-open"></i>
                            )}{" "}
                            Update password?{" "}
                        </i>
                        {changePw && (
                            <div>
                                <h4>
                                    <i className="fa-solid fa-key"></i>Change your password
                                </h4>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        name="newPassword"
                                        value={newPassword || ""}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        name="newPassword2"
                                        value={newPassword2 || ""}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        value="Update">
                        Submit
                    </button>

                    <button
                        className="btn btn-warning"
                        disabled={loading}
                        onClick={deleteAccount}>
                        Delete Account
                    </button>
                </form>
            </section>
        </div>
    );
}

export default Profile;
