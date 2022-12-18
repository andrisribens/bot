import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';

import './App.css';
import background from '../../images/chatbot.jpg';
import Chat from '../chat/Chat.jsx';
import Footer from '../footer/Footer.jsx';

export default function App() {
  return (
    <Fragment>
      <div
        className="main-block"
        style={{ backgroundImage: 'url(' + background + ')' }}
      >
        <Grid container>
          <Grid item md={2}></Grid>
          <Grid item xs={12} md={10} paddingLeft={1} paddingTop={1}>
            <h1/>
            <h1/>
            <Chat />
          </Grid>
        </Grid>
      </div>
      <Footer />
    </Fragment>
  );
}
