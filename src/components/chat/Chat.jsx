import React, {Fragment, useState, useRef, useEffect} from 'react';
import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

import "./Chat.css";
import ChatBubble from '../chatBubble/ChatBubble';


function Chat() {

    const scrollBottomRef = useRef(null);
    const webSocket = useRef(null);

    const [chatBubbles, setChatBubbles] = useState([
      // {author: "Oscar", text: "What do you want me to do now?"}
    ]);
 
    const [inputMessage, setInputMessage] = useState(
      {author: "You", text: ""}
    );

    //create webSocket object and connection
    useEffect(() => {
    webSocket.current = new WebSocket("ws://zoozl.net:1601/");
    console.log("Opening websocket...");

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
      const receivedMessage = JSON.parse(event.data);
      console.log("Received message: ", receivedMessage);
      setChatBubbles([...chatBubbles, {
        author: receivedMessage.author,
        text: receivedMessage.text
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
            webSocket.current.send(JSON.stringify(inputMessage));
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
            webSocket.current.send(JSON.stringify(inputMessage));
            console.log("Sending message...", inputMessage);
            setChatBubbles([...chatBubbles, {
              author: inputMessage.author,
              text: inputMessage.text
            }]);
            setInputMessage({author: "You", text: ""});
        }
        }}

        const createChatBubbles = chatBubbles.map((chatMessage, index) => 
              <ChatBubble
                key={index}
                author={chatMessage.author}
                text={chatMessage.text}
                color={(chatMessage.author === "You") ? "#69f0ae" : "#d9edfd"}
                justifyContent={(chatMessage.author === "You") ? "flex-end" : "flex-start"}
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