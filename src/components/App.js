import React, {useState} from 'react'; 

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";

import background from "../images/robot-picture2.jpg";
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';


function App() {

  function createChatBubbles (bubbleInfo) {
    return (
      <ChatBubble
        author={bubbleInfo.author}
        text={bubbleInfo.text}
        color={(bubbleInfo.author === "You") ? "#69f0ae" : "#d9edfd"}
        alignItem={(bubbleInfo.author === "You") ? "flex-end" : "flex-start"}
      />
    );
  }

  const [chatBubbles, setChatBubbles] = useState([
    { author: "Oscar", 
    text: "Hello, my names is Oscar. I am a chat bot. What do you want me to do?"}
  ]);

  function addChatBubble(addedBubble) {
    setChatBubbles((prevBubbles) => {
      return [...prevBubbles, addedBubble];
    });
  }



  return (
    <div className="main-block"
    style={{
      backgroundImage: "url(" + background + ")"
      }}
    >
    <Grid container>
    <Grid item md={2}></Grid>
    <Grid item xs={12} md={10} paddingLeft={1} paddingTop={5}>
      <div className='top-headers'>
      <h1>Hello, my name is Oscar. I can be your bot.</h1>
      <p>I can be your accountant. I can be your secretary. I can be anything.</p>
      </div>

      <Box 
      sx={{
        width: "400px",
        height: "420px",
        maxWidth: "95%"      
          }}
      >
        <Paper sx={{
          width: '100%',
          height: '100%',
          p: "5px",
          backgroundColor: "rgb(0,0,0,0.5)",
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: 'no-wrap',
          flexDirection: 'column'
          // border: "2px solid white"
          }}
          elevation={7}
          >
            <Box
            className='chat-window'
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              flexWrap: 'no-wrap',
              flexDirection: 'column',
            }}
             >
              {chatBubbles.map(createChatBubbles)}
            </Box>
          <ChatInput 
            onAdd={addChatBubble}
            author="You"
          
          />
        </Paper>
      </Box>
      </Grid>
      </Grid>
    </div>
  );
}

export default App;
