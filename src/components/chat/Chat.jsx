import React, {Fragment, useState, useRef, useEffect} from 'react';
import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

import "./Chat.css";
import ChatBubble from '../chatBubble/ChatBubble';
import {ChatMessageDto} from '../../model/ChatMessageDto.js';


function Chat() {

    const scrollBottomRef = useRef(null);
    const webSocket = useRef(null);

    const [chatBubbles, setChatBubbles] = useState([
        new ChatMessageDto("Oscar", "I am a chat bot. What do you want me to do?")
          ]);
 
    const [inputMessage, setInputMessage] = useState(
      {author: "You", text: ""}
    );

    //create webSocket object and connection
    useEffect(() => {
    console.log("Opening websocket...");
    webSocket.current = new WebSocket("ws://zoozl.net:1601/");
    webSocket.onopen = (event) => {
      console.log("Open:", event);
    }
    webSocket.onclose = (event) => {
        console.log("Close:", event);
    }
    return () => {
      console.log("Not closing webSocket...");
      // webSocket.current.close();
    };
    }, []);

  useEffect(() => {
    webSocket.current.onmessage = (event) => {
      const receivedMessageDto = JSON.parse(event.data);
      console.log("Received message: ", receivedMessageDto);
      setChatBubbles([...chatBubbles, {
        author: receivedMessageDto.author,
        text: receivedMessageDto.text
      }]);
    }
      if (scrollBottomRef.current) {
        scrollBottomRef.current.scrollIntoView({behavior: "smooth"});
      }

  }, [chatBubbles]);

  
      function handleMessageChange(event) {
        setInputMessage({author: "You", text: event.target.value});
      }
  
      const sendMessage = (event) => {
        event.preventDefault();
        if (inputMessage.text) {
            webSocket.current.send(JSON.stringify(new ChatMessageDto(inputMessage)));
            console.log("Sending message...", inputMessage);
            setChatBubbles([...chatBubbles, {
              author: inputMessage.author,
              text: inputMessage.text
            }]);
            setInputMessage({author: "You", text: ""});
            }
      }
      
  
      const handleKeyPress = (event) => {
        if (event.key === "Enter") {
          event.preventDefault(); //this code prevents default behaviour of enter key: creation of next line
          
        if (inputMessage.text) {
            webSocket.current.send(JSON.stringify(new ChatMessageDto(inputMessage)));
            console.log("Sending message...", inputMessage);
            setChatBubbles([...chatBubbles, {
              author: inputMessage.author,
              text: inputMessage.text
            }]);
            setInputMessage({author: "You", text: ""});
        }
        }}

        const createChatBubbles = chatBubbles.map((chatMessageDto, index) => 
              <ChatBubble
                key={index}
                author={chatMessageDto.author}
                text={chatMessageDto.text}
                color={(chatMessageDto.author === "You") ? "#69f0ae" : "#d9edfd"}
                justifyContent={(chatMessageDto.author === "You") ? "flex-end" : "flex-start"}
              />
        );
          

    return (
        <Fragment>
          <Paper  
            elevation={7}
            sx={{
              width: "370px",
              maxWidth: "98%",
              height: "420px",
              backgroundColor: "rgb(0,0,0,0.5)"
            }}
          >
            <Box 
            p={1}
            sx={{
              width: "100%",
              height: "96%",
              maxWidth: "95%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              flexWrap: "nowrap"
            }}
            >
                        <Box className="chat-window">
                          {createChatBubbles}
                          <Box ref={scrollBottomRef} />
                        </Box>
                        <Box>
                            <form onSubmit={sendMessage}>
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
                                    />
                                    <Button 
                                        aria-label="Send Message"
                                        type="submit" 
                                        variant="contained" 
                                        size='large' 
                                        sx={{height:"55px"}}>
                                        <SendIcon />
                                    </Button>    
                                </Stack>
                                </form>
                        </Box>
                   
                 </Box>
            </Paper>
        </Fragment>
    )
}

export default Chat;