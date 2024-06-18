import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getCommentsByRecipeId } from "../../services/commentService";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

const Comments = () => {
	const { id } = useParams();
	const [comments, setComments] = useState([]);

	useEffect(() => {
		const fetchComments = async () => {
			const commentsData = await getCommentsByRecipeId(id);
			setComments(commentsData);

		};
		fetchComments();
	}, [id]);

	console.log(comments)
	return (
		<div>
			<ul>
				{comments || comments.length > 0 ? (
					comments.map((comment) => (
						<Comment key={comment._id} comment={comment} />
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
