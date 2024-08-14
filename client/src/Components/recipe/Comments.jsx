import React, { useState, useEffect } from "react";
import NotFound from "../layout/NotFound";
import {
	getCommentsByRecipeId,
	deleteCommentById,
	createComment,
} from "../../services/commentService";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

const Comments = ({ showToast, panelOpen, onClose, recipe }) => {
	const [comments, setComments] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const commentsData = await getCommentsByRecipeId(recipe);
				setComments(commentsData);
			} catch (err) {
				setError(err.message);
			}
		};
		fetchComments();
	}, [recipe]);

	const handleDeleteComment = async (comment) => {
		try {
			const res = await deleteCommentById(comment._id);
			setComments(res.sort((a, b) => new Date(a.date) - new Date(b.date)));
			showToast("Comment deleted successfully", "success");
		} catch (err) {
			showToast("Failed to delete comment. 😣 Please try again", "error");
		}
	};

	const handleAddComment = async (id, text) => {
		try {
			setLoading(true);
			const res = await createComment(id, text);
			setComments(res.sort((a, b) => new Date(a.date) - new Date(b.date)));
			showToast("Comment added successfully", "success");
			setLoading(false);
		} catch {
			setLoading(false);
		}
	};

	return error ? (
		<NotFound message={error} />
	) : (
		panelOpen && (
			<div className="panel">
				<i className="fa fa-x" onClick={onClose} />
				<div className="comments-container">
					<div className="comment-main-level">
						<h2>Comments</h2>
						<div className="links">
							<span onClick={onClose}>
								<i className="fas fa-arrow-left" />
								Back to recipe
							</span>
						</div>
						{loading && <i className="fa fa-spinner spinner"></i>}

						{comments.length > 0 ? (
							<ul className="comments-list">
								{comments.map((comment) => (
									<Comment
										showToast={showToast}
										key={comment._id}
										comment={comment}
										deleteComment={handleDeleteComment}
									/>
								))}
							</ul>
						) : (
							<p>This recipe has no comments</p>
						)}
						<CommentForm
							loading={loading}
							handleAddComment={handleAddComment}
							showToast={showToast}
						/>
					</div>
				</div>
			</div>
		)
	);
};

export default Comments;
