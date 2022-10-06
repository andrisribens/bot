import React from 'react';
import Paper  from '@mui/material/Paper';


function ChatBubble(props) {

    return (
        <div 
        className='chat-bubble' 
        style={{alignSelf: props.alignItem, maxWidth: "80%"}}>
            <Paper 
            elevation={7}
            sx={{
                backgroundColor: props.color,
                opacity: 1,
                padding: 0.7,
                // flex: 1,
                marginBottom: "10px",
                
            }}
            >
                <h6>{props.author}</h6>
                <p>{props.text}</p>
            </Paper>
        </div>

    )
}

export default ChatBubble;
