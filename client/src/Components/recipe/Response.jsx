import React from "react";
import { Link } from "react-router-dom";

function Response({ response, deleteResponse }) {
	const responseDate = new Date(response.date).toLocaleDateString();

	const handleDeleteResponse = async () => {
		try {
			await deleteResponse(response);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div>
			{" "}
			<button onClick={handleDeleteResponse}>X</button>
			<div key={response._id}>
				<p>{response.text}</p>
				<p>
					by <Link to={`/profiles/${response.user}`}>{response.userName}</Link>{" "}
					on {responseDate}
				</p>
			</div>
		</div>
	);
}

export default Response;
