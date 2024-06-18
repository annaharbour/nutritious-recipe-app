import React, { useState } from "react";
import Response from "./Response";

const Comment = ({ comment }) => {
	const [seeResponses, setSeeResponses] = useState(false);
	const date = new Date(comment.date).toLocaleDateString();

	const handleToggleResponses = () => {
		setSeeResponses(!seeResponses);
	};

	const handleLike = () => {
		// handle like functionality
	}

	const handleReply = () => {
		// handle reply functionality
	}

	return (
		<div className="comment" style={{"border": "1px solid black", "width": "50%"}}>
			<p>{comment.text}</p>
			<p>by {comment.userName} on {date}</p>
			{comment.likes.length > 0 && <p>{comment.likes.length} Likes</p>}
			<button onClick={handleLike}>Like</button>
			<button onClick={handleReply}>Reply</button>
			{comment.responses.length > 0 && (
				<button onClick={handleToggleResponses}>
					{seeResponses ? "Hide" : "View"} {comment.responses.length} Responses
				</button>
			)}
			{seeResponses && (
				<ul>
					{comment.responses.map((response, index) => (
						<Response key={index} response={response} />
					))}
				</ul>
			)}
		</div>
	);
};

export default Comment;
