import React from "react";

function Response({ response }) {
	return (
		<div>
			{" "}
			<div key={response._id}>
				<p>{response.userName}</p>
				<p>{response.date.toLocaleDateString()}</p>
                <p>{response.text}</p>
			</div>
		</div>
	);
}

export default Response;
