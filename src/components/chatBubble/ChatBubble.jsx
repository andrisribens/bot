import React from 'react';
import Paper  from '@mui/material/Paper';

import './ChatBubble.css';


export default function ChatBubble(props) {

    return (
        <div 
            className='chat-bubble' 
            style={{justifyContent: props.justifyContent}}>
                <Paper 
                    elevation={7}
                    sx={{
                        backgroundColor: props.color,
                        opacity: 1,
                        padding: 0.7,
                        marginBottom: "10px",
                    }}
                    >
                    <h6>{props.author}</h6>
                    <p>{props.text}</p>
                </Paper>
        </div>

    )
}
