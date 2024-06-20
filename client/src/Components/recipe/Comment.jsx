import React, { useState } from "react";
import Response from "./Response";
import ResponseForm from "./ResponseForm";
import { deleteResponse, respondToComment, toggleLikeComment } from "../../services/commentService";
import { useAuth } from "../auth/AuthContext";

const Comment = ({ comment, deleteComment, likeComment }) => {
    const userInfo = useAuth().userInfo;
    const [seeResponses, setSeeResponses] = useState(false);
    const [seeReplyBox, setSeeReplyBox] = useState(false);
    const [responses, setResponses] = useState(comment.responses.sort((a, b) => new Date(a.date) - new Date(b.date)));
    const [likes, setLikes] = useState(comment.likes.length);
    const [userHasLiked, setUserHasLiked] = useState(
        Array.isArray(comment.likes) && comment.likes.some((like) => like.user === userInfo._id)
    );
    const date = new Date(comment.date).toLocaleDateString();

    const handleLike = async () => {
        try {
            const updatedLikes = await toggleLikeComment(comment._id);
            setLikes(updatedLikes.length);
            setUserHasLiked(!userHasLiked);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteComment = async () => {
        try {
            await deleteComment(comment);
        } catch (err) {
            console.log(err);
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
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="comment" style={{ border: "1px solid black", width: "50%" }}>
            <p>
                {comment.text}
                <button onClick={handleDeleteComment}>X</button>
            </p>
            <p>
                by {comment.userName} on {date}
            </p>
            {likes > 0 && <p>{likes} Likes</p>}
            <button onClick={handleLike}>{userHasLiked ? "Unlike" : "Like"}</button>
            <button onClick={handleReply}>Reply</button>
            {seeReplyBox && (
                <ResponseForm addResponse={handleAddResponse} commentId={comment._id} />
            )}
            {responses.length > 0 && (
                <button onClick={handleToggleResponses}>
                    {seeResponses ? "Hide" : "View"} {responses.length} Responses
                </button>
            )}
            {seeResponses && (
                <ul>
                    {responses.map((response, index) => (
                        <Response
                            key={index}
                            response={response}
                            deleteResponse={handleDeleteResponse}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Comment;
