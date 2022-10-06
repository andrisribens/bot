import React, {useState} from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

function ChatInput (props) {

    const [inputMessage, setInputMessage] = useState({ 
      author: props.author,
      text: ""
    });

    function handleMessageChange(event) {
      const { name, value } = event.target;
      setInputMessage((prevMessage) => {
        return {
         ...prevMessage, [name]: value}
        });
    }

    function submitMessage(event) {
      event.preventDefault();
      props.onAdd(inputMessage);
      setInputMessage({author: "You", text: ""});
    }
    
    function handleKeyPress(event) {
      if (event.key === "Enter") {
        event.preventDefault(); //this code prevents default behaviour of enter key: creation of next line
        props.onAdd(inputMessage);
        setInputMessage({author: "You", text: ""});
    }}

    return (
        <>
        <form onSubmit={submitMessage}>
          <Stack 
          direction="row" 
          spacing={0.5} 
          alignItems="flex-end"
          >
            <TextField
            focused
            multiline
            name="text"
            value={inputMessage.text}
            onChange={handleMessageChange}
            onKeyPress={(event) => handleKeyPress(event)}
            placeholder='Write something'
            sx={{
              width:"95%",
              backgroundColor: "white", 
              }}
            ></TextField>

            <Button type="submit" variant="contained" size='large' sx={{height:"55px"}}>
              <SendIcon />
            </Button>    
          </Stack>
        </form>
        </>
    );
}

export default ChatInput;
