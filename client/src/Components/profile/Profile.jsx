import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
	getProfileById,
	createProfile,
	updateProfile,
} from "../../services/profileService";
function Profile() {
	const userInfo = useAuth().userInfo;
	const [isEditing, setIsEditing] = useState(false);
	const [profileInfo, setProfileInfo] = useState(null);
	const [userBio, setUserBio] = useState("");

	useEffect(() => {
		const fetchProfileInfo = async () => {
			try {
				const response = await getProfileById(userInfo._id);
				setProfileInfo(response.data);
				setUserBio(response.data.bio);
				console.log(response.data.bio);
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};
		fetchProfileInfo();
	}, [userInfo]);

	const handleChange = async (e) => {
		setUserBio(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(userBio);
		try {
			if (!profileInfo) {
				const createdProfile = await createProfile(userInfo._id, userBio);
				setProfileInfo(createdProfile.data);
				setIsEditing(false);
			} else {
				const updatedProfile = await updateProfile(userInfo._id, userBio);
				setProfileInfo(updatedProfile.data);
				setIsEditing(false);
			}
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	};

	return (
		<>
			<h1>{userInfo.name}</h1>
			<div>
				{isEditing ? (
					<form className="profile-form" onSubmit={handleSubmit}>
						<label htmlFor="bio">bio</label>
						<input
							type="text"
							id="bio"
							value={userBio}
							onChange={handleChange}></input>
						<button type="submit">
							<i className="fa-solid fa-check"></i>
						</button>
					</form>
				) : (
					<>
						<p>{profileInfo && profileInfo.bio}</p>
						<button onClick={() => setIsEditing(true)}>
							<i className="fa-solid fa-pencil"></i>
						</button>
					</>
				)}
			</div>
		</>
	);
}

export default Profile;
