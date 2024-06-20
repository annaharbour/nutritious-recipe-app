import React, {useState} from 'react'

function ResponseForm({commentId, addResponse}) {
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!text){
            alert('Please enter a comment before submitting.')
            return;
        }
        addResponse(commentId, text);  
        setText(''); 
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