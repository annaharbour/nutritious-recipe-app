import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CommentForm = ({ showToast, loading, handleAddComment }) => {
	const [text, setText] = useState("");
	const { id } = useParams();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!text) {
				showToast("Please enter a comment before submitting.", "error");
				return;
			}
			await handleAddComment(id, text);
			setText("");
		} catch (error) {
			showToast("Failed to add comment. 😣 Try again.", "error");
			console.error(error);
		}
	};

	return (
		<form className="comment-form" onSubmit={handleSubmit}>
			<textarea
				onChange={(e) => setText(e.target.value)}
				value={text}
				placeholder="Write your comment..."
				disabled={loading}
			/>
			<i className="fas fa-paper-plane" onClick={handleSubmit}>{" "}comment</i>
		</form>
	);
};

export default CommentForm;
