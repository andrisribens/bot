import React, { Fragment, useState, useRef, useEffect } from 'react';
import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

import './Chat.css';
import ChatBubble from '../chatBubble/ChatBubble';
import { useWebSocket } from '../websocket/WebSocketContext.jsx';


function Chat() {
    const { sendJson, subscribe } = useWebSocket();
    const endOfMessages = useRef(null);
    const [chatBubbles, setChatBubbles] = useState([]);
    const [inputMessage, setInputMessage] = useState({ author: 'You', text: '' });

    useEffect(() => {
        const unsubscribe = subscribe((event) => {
            try {
                const receivedMessage = JSON.parse(event.data);
                if (receivedMessage.operation || receivedMessage.auth) {
                    return;
                }
                if (!receivedMessage.text) {
                    return;
                }
                setChatBubbles((chatBubbles) => [
                    ...chatBubbles,
                    {
                        author: receivedMessage.author,
                        text: receivedMessage.text,
                    },
                ]);
            } catch (err) {
                console.error('Failed to parse chat message.', err);
            }
        });
        return unsubscribe;
    }, [subscribe]);
  
    useEffect(() => {
        if (endOfMessages.current) {
            endOfMessages.current.scrollIntoView(
                false
        );
        }
    }, [chatBubbles]);

    function handleMessageChange(event) {
        setInputMessage({ author: 'You', text: event.target.value });
    };

    function sendToServer(message) {
        /*
         * Try to send the message to backend
         *
         * @param {object} message - containing author and text
         *
         * When connection is not OPEN, try to reinitialise connection
        */
        const payload = {
            author: message.author,
            text: message.text,
        };
        sendJson(payload).then((sent) => {
            if (!sent) {
                return;
            }
            setChatBubbles((currentBubbles) => [
              ...currentBubbles,
              payload,
            ]);
        });
    };

    function sendMessage(event) {
        // Prevent reload of the page upon form submit
        event.preventDefault();
        if (inputMessage.text) {
            sendToServer(inputMessage);
            setInputMessage({ author: 'You', text: '' });
        }
    };

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            //this code prevents default behaviour of enter key: creation of next line
            event.preventDefault();
            if (inputMessage.text) {
                sendToServer(inputMessage);
            setInputMessage({ author: 'You', text: '' });
            }
        }
    };


    const createChatBubbles = chatBubbles.map((chatMessage, index) => (
        <ChatBubble
            key={index}
            author={chatMessage.author}
            text={chatMessage.text}
            color={chatMessage.author === 'You' ? '#69f0ae' : '#d6e8f2'}
            justifyContent={chatMessage.author === 'You' ? 'flex-end' : 'flex-start'}
        />
    ));

    return (
    <Fragment>
      <Paper
        elevation={7}
        sx={{
          width: '370px',
          maxWidth: '98%',
          minWidth: '320px',
          height: '420px',
          backgroundColor: 'rgb(0,0,0,0.5)',
        }}
      >
        <Box
          p={1}
          sx={{
            width: '100%',
            height: '96%',
            maxWidth: '95%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            flexWrap: 'nowrap',
          }}
        >
          <Box className="chat-window">
            {createChatBubbles}
            <Box ref={endOfMessages} />
          </Box>
          <Box>
            <form onSubmit={sendMessage}>
              <Stack direction="row" spacing={0.5} alignItems="flex-end">
                <TextField
                  focused
                  multiline
                  name="text"
                  value={inputMessage.text}
                  onChange={handleMessageChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Raksti šeit"
                  sx={{
                    width: '95%',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                  }}
                />
                <Button
                  aria-label="Sūtīt ziņu"
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ height: '56px' }}
                >
                  <SendIcon />
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Paper>
    </Fragment>
  );
}

export default Chat;
