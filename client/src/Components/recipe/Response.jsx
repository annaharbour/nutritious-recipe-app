import React from "react";
import { Link } from "react-router-dom";

function Response({
	response,
	deleteResponse,
	showToast,
	userInfo,
	originalPoster,
}) {
	const responseDate = new Date(response.date).toLocaleDateString();

	const handleDeleteResponse = async () => {
		try {
			await deleteResponse(response);
		} catch (err) {
			showToast("Whoops! Try deleting your response again.", "error");
		}
	};

	return (
		<li className="comment-box">
			<div key={response._id}>
				<div className="comment-head">
					<Link
						className={`comment-name ${
							originalPoster === response.user ? "by-author" : ""
						}`}
						to={`/profiles/${response.user}`}>
						{response.userName}
					</Link>
					<span>{responseDate}</span>
					{response.user === userInfo._id && (
						<i className="fas fa-x" onClick={handleDeleteResponse} />
					)}
				</div>
				<div className="comment-content">{response.text}</div>
			</div>
		</li>
	);
}

export default Response;
