import React from "react";
import { deleteUser } from "../...services/userService";
import { useAuth } from "../auth/AuthContext";
const DeleteAccount = () => {
    const userInfo = useAuth().userInfo;
	const handleDelete = async () => {
		try {
			const res = await deleteUser({ userId: userInfo._id });
			console.log(res.data);
		} catch (error) {
			// Handle error
			console.error(error);
		}
	};

	return (
		<div>
			<h1>Delete Account</h1>
			<button onClick={handleDelete}>Delete Account</button>
		</div>
	);
};

export default DeleteAccount;
