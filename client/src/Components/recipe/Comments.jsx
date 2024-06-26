import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import NotFound from "../layout/NotFound";
import {
	getCommentsByRecipeId,
	deleteCommentById,
} from "../../services/commentService";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

const Comments = ({showToast}) => {
	const { id } = useParams();
	const [comments, setComments] = useState([]);
	const [error, setError] = useState(null);

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
			await deleteCommentById(comment._id);
			setComments((prevComments) =>
				prevComments.filter((c) => c._id !== comment._id)
			);
		} catch (err) {
			console.log(err.message);
		}
	};

	return error ? (
		<NotFound message={error} />
	) : (
		<div>
			<ul>
				{comments.length > 0 ? (
					comments.map((comment) => (
						<Comment
							showToast={showToast}
							key={comment._id}
							comment={comment}
							deleteComment={handleDeleteComment}
						/>
					))
				) : (
					<p>This recipe has no comments</p>
				)}
			</ul>
			<CommentForm />
		</div>
	);
};

export default Comments;
