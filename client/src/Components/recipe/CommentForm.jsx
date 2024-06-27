import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CommentForm = ({ showToast, loading, handleAddComment }) => {
	const [text, setText] = useState("");
	const { id } = useParams();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!text) {
				showToast("Please enter a comment before submitting.");
				return;
			}
			await handleAddComment(id, text);
			setText("");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				onChange={(e) => setText(e.target.value)}
				value={text}
				placeholder="Write your comment..."
				disabled={loading}
			/>
			<button disabled={loading} type="submit">
				{loading ? "Submitting..." : "Submit"}
			</button>
		</form>
	);
};

export default CommentForm;
