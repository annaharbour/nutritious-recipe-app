import React, { useState } from "react";

function ResponseForm({ commentId, addResponse, showToast }) {
	const [text, setText] = useState("");

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			if (!text) {
				showToast("Please enter a comment before submitting.", "error");
				return;
			}
			addResponse(commentId, text);
			setText("");
			showToast("Response added successfully!", "success");
		} catch (err) {
			console.log(err);
			showToast("Failed to add response. Please try again later.", "error");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Write your response..."></textarea>
			<button type="submit">Submit</button>
		</form>
	);
}

export default ResponseForm;
