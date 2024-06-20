import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import {createComment} from '../../services/commentService';

const CommentForm = () => {
    const [text, setText] = useState('');
    const {id} = useParams();
    const handleSubmit = async (e) => {
        if(!text){
            alert('Please enter a comment before submitting.')
            return;
        }
        // Add your logic to handle the comment submission here
        const res = await createComment(id, text);
        console.log(res);
        setText(''); // Clear the input field
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea                
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your comment..."
            ></textarea>
            <button type="submit">Submit</button>
        </form>
    );
};

export default CommentForm;