import React, {Fragment} from 'react'; 
import Grid from "@mui/material/Grid";

import "./App.css";
import background from "../../images/robot-picture2.jpg"
import Chat from '../chat/Chat.jsx';
import Footer from '../footer/Footer.jsx';

export default function App() {


  return (
    <Fragment>
    <div 
      className="main-block"
      style={{backgroundImage: "url(" + background + ")"}}
    >
      <Grid container>
        <Grid item md={2}></Grid>
        <Grid item xs={12} md={10} paddingLeft={1} paddingTop={5}>
          <div className='top-headers'>
          <h1>Hello, my name is Oscar. I can be your personal bot.</h1>
          <p>I can work as your accountant or secretary. I can be anything. Just ask.</p>
          </div>

        <Chat />

        </Grid>
      </Grid>
    </div>
    <Footer />
    </Fragment>  
    );
}


