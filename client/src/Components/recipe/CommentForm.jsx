import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createComment } from "../../services/commentService";

const CommentForm = ({showToast}) => {
	const [text, setText] = useState("");
	const { id } = useParams();
	const handleSubmit = async (e) => {
		try {
			if (!text) {
				alert("Please enter a comment before submitting.");
				return;
			}
			await createComment(id, text);
			setText("");
		} catch (error) {
            showToast("error", error)
        }
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				onChange={(e) => setText(e.target.value)}
				placeholder="Write your comment..."></textarea>
			<button type="submit">Submit</button>
		</form>
	);
};

export default CommentForm;
