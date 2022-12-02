import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';

import './App.css';
import background from '../../images/robot-picture2.jpg';
import Chat from '../chat/Chat.jsx';
import ContactBlock from '../contactBlock/ContactBlock.jsx';
import AboutBlock from '../aboutBlock/AboutBlock.jsx';
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
          <Grid item xs={12} md={10} paddingLeft={1} paddingTop={5}>
            <div className="top-headers">
              <h1>
                Get your own personal{' '}
                <span className="h1-important">chatbot</span>
              </h1>
              <h3>
                It can work as your accountant or secretary. It can play games.
                It can do many things.
              </h3>
            </div>

            <Chat />
          </Grid>
        </Grid>
      </div>
      <ContactBlock />
      <AboutBlock />
      <Footer />
    </Fragment>
  );
}
