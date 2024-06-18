import React, {useState} from 'react'
import { respondToComment } from '../../services/commentService';

function ResponseForm({commentId}) {
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!text){
            alert('Please enter a comment before submitting.')
            return;
        }
        await respondToComment(commentId, text);
        // Reset the comment input
        setText(''); // Clear the input field
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your response..."
            ></textarea>
            <button type="submit">Submit</button>
        </form>
  )
}

export default ResponseForm