import React from "react";

function Response({ response, deleteResponse}) {
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
			{" "}<button onClick={handleDeleteResponse}>X</button>
			<div key={response._id}>
				<p>{response.text}</p>
				<p>by {response.userName} on {responseDate}</p>
			</div>
		</div>
	);
}

export default Response;
