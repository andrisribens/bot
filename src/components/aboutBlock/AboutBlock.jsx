import React, { Fragment } from 'react';

import './AboutBlock.css';
import { Divider } from '@mui/material';

export default function AboutBlock() {
  return (
    <Fragment>
      <div className="about-block">
        <div className="about-block-content">
          <h2>Why chatbot?</h2>
          <div className="testimonial-box">
            <h3>
              "I wanted my daughter to help me out with accounting. She is Gen Z
              and obviously did not want to hear anything about Excel
              spreadsheets. So i built a chatbot for her to do the accounting.
            </h3>
            <h3>
              It worked great! And I thought there should be some other people
              with daunting daily tasks chatbot could do for them. Thus Chatbot
              was born!"
            </h3>
            <Divider
              sx={{
                width: '40%',
                alignSelf: 'flex-end',
                borderColor: 'rgba(255, 255, 255, 0.32)',
                marginTop: '30px',
              }}
            />
            <h4>Juris Kaminskis</h4>
            <p>
              Professional backend developer with experience in network layered
              API development
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
