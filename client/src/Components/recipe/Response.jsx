import React from "react";
import { Link } from "react-router-dom";

function Response({ response, deleteResponse, showToast }) {
	const responseDate = new Date(response.date).toLocaleDateString();

	const handleDeleteResponse = async () => {
		try {
			await deleteResponse(response);
		} catch (err) {
			showToast(err.message, "error");
		}
	};
	return (
		<li className="comment-box">
			{" "}
			<i className="fas fa-x" onClick={handleDeleteResponse} />
			<div key={response._id}>
				<div className="comment-content">{response.text}</div>
				<div className="comment-head">
					by <Link to={`/profiles/${response.user}`}>{response.userName}</Link>{" "}
					on {responseDate}
				</div>
			</div>
		</li>
	);
}

export default Response;
