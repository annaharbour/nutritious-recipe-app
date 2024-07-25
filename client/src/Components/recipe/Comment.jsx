import React, { useState } from "react";
import { Link } from "react-router-dom";
import Response from "./Response";
import ResponseForm from "./ResponseForm";
import {
	deleteResponse,
	respondToComment,
	toggleLikeComment,
} from "../../services/commentService";
import { useAuth } from "../auth/AuthContext";

const Comment = ({ comment, deleteComment, showToast }) => {
	const userInfo = useAuth().userInfo;
	const [seeResponses, setSeeResponses] = useState(false);
	const [seeReplyBox, setSeeReplyBox] = useState(false);
	const [responses, setResponses] = useState(
		comment.responses.sort((a, b) => new Date(a.date) - new Date(b.date))
	);
	const [likes, setLikes] = useState(comment.likes.length);
	const [userHasLiked, setUserHasLiked] = useState(
		Array.isArray(comment.likes) &&
			comment.likes.some((like) => like.user === userInfo._id)
	);
	const date = new Date(comment.date).toLocaleDateString();

	const handleLike = async () => {
		try {
			const updatedLikes = await toggleLikeComment(comment._id);
			setLikes(updatedLikes.length);
			setUserHasLiked(!userHasLiked);
		} catch (err) {
			showToast("Error liking comment", "error");
		}
	};

	const handleDeleteComment = async () => {
		try {
			await deleteComment(comment);
		} catch (err) {
			showToast("Error deleting comment", "error");
		}
	};

	const handleToggleResponses = () => {
		setSeeResponses(!seeResponses);
	};

	const handleReply = () => {
		setSeeReplyBox(!seeReplyBox);
	};

	const handleAddResponse = async (commentId, text) => {
		try {
			const res = await respondToComment(commentId, text);
			setResponses(res.sort((a, b) => new Date(a.date) - new Date(b.date)));
			setSeeReplyBox(false);
			setSeeResponses(true);
		} catch (err) {
			console.log(err);
		}
	};

	const handleDeleteResponse = async (response) => {
		try {
			const res = await deleteResponse(response._id);
			setResponses(res.sort((a, b) => new Date(a.date) - new Date(b.date)));
			showToast("Response deleted successfully", "success");
		} catch (err) {
			showToast(err.message, "error");
		}
	};

	return (
		<div>
			<li className="comment-box">
				<div className="comment-content">{comment.text}</div>

				{comment.user === userInfo._id && (
					<i className="fas fa-x" onClick={handleDeleteComment} />
				)}
				<div className="comment-head">
					by{" "}
					<Link
						className="comment-name by-author"
						to={`/profiles/${comment.user}`}>
						{comment.userName}
					</Link>{" "}
					on {date}
					{likes > 0 && <p>{likes}</p>}
					{userHasLiked ? (
						<i className="fa-solid fa-thumbs-up" onClick={handleLike} />
					) : (
						<i className="fa-regular fa-thumbs-up" onClick={handleLike} />
					)}
					<i className="fa fa-reply" onClick={handleReply} />
				</div>

				{responses.length > 0 && (
					<button onClick={handleToggleResponses}>
						{seeResponses ? "Hide" : "View"} {responses.length} Responses
					</button>
				)}
			</li>
			{seeResponses && (
				<ul className="reply-list">
					{responses.map((response, index) => (
						<Response
							showToast={showToast}
							key={index}
							response={response}
							deleteResponse={handleDeleteResponse}
						/>
					))}
				</ul>
			)}
			{seeReplyBox && (
				<ResponseForm
					showToast={showToast}
					addResponse={handleAddResponse}
					commentId={comment._id}
				/>
			)}
		</div>
	);
};

export default Comment;
