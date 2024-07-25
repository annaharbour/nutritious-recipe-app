import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import NotFound from "../layout/NotFound";
import {
	getCommentsByRecipeId,
	deleteCommentById,
	createComment,
} from "../../services/commentService";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

const Comments = ({ showToast }) => {
	const { id } = useParams();
	const [comments, setComments] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const commentsData = await getCommentsByRecipeId(id);
				setComments(commentsData);
			} catch (err) {
				setError(err.message);
			}
		};
		fetchComments();
	}, [id]);

	const handleDeleteComment = async (comment) => {
		try {
			const res = await deleteCommentById(comment._id);
			setComments(res.sort((a, b) => new Date(a.date) - new Date(b.date)));
			showToast("Comment deleted successfully", "success");
		} catch (err) {
			showToast("Failed to delete comment. Please try again", "error");
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
		<div className="comments-container">
			<div className="comment-main-level">
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
	);
};

export default Comments;
