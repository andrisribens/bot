import React, { Fragment, useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';
import FaceIcon from '@mui/icons-material/Face';
import Collapse from '@mui/material/Collapse';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import './ContactBlock.css';

export default function ContactBlock() {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [formInput, setFormInput] = useState({});
  const [messages, setMessages] = useState([]);
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);

  const formStartRef = useRef(null);

  function handleFormOpen() {
    setFormIsOpen(!formIsOpen);
    formStartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleOnChange(event) {
    const { name, value } = event.target;
    setFormInput((prevFormInput) => {
      return { ...prevFormInput, [name]: value };
    });
  }

  function handleOnSubmit(event) {
    event.preventDefault();
    setMessages((prevMessages) => {
      return [...prevMessages, formInput];
    });
    setFormIsOpen(false);
    event.target.reset();
    setTimeout(() => setSuccessAlertOpen(true), 1000);
  }

  function handleCloseAlert() {
    setSuccessAlertOpen(false);
  }

  return (
    <Fragment>
      <div className="contact-block">
        <div className="contact-block-content">
          <h2>Contact Us</h2>
          <form
            onSubmit={handleOnSubmit}
            onChange={handleOnChange}
            id="contact_form"
          >
            <Collapse in={formIsOpen}>
              <Grid container>
                <Grid item xs={12} p={1}>
                  <TextField
                    ref={formStartRef}
                    focused={formIsOpen}
                    required
                    name="from_name"
                    label="Your name"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaceIcon />
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                </Grid>

                <Grid item xs={12} sm={6} p={1}>
                  <TextField
                    required
                    name="from_email"
                    label="Your email"
                    fullWidth
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                </Grid>

                <Grid item xs={12} sm={6} p={1}>
                  <TextField
                    name="from_phone"
                    label="Your phone number (optional)"
                    fullWidth
                    type="tel"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneAndroidIcon />
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                </Grid>

                <Grid item xs={12} p={1}>
                  <TextField
                    required
                    name="message"
                    label="Your message"
                    multiline
                    fullWidth
                    minRows={5}
                    placeholder="Please tell us briefly how can we help you!"
                  ></TextField>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <button
                  className="large-contact-btn"
                  size="large"
                  type="submit"
                >
                  Submit
                </button>
              </Grid>
            </Collapse>
            {!formIsOpen && (
              <Grid item xs={12}>
                <button className="large-contact-btn" onClick={handleFormOpen}>
                  Send us a message
                </button>
                <p>If you want to get your personal chatbot</p>
              </Grid>
            )}
          </form>
        </div>
      </div>

      {/* Show success alert */}
      <Snackbar
        open={successAlertOpen}
        onClose={handleCloseAlert}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ textAlign: 'left' }}
      >
        <Alert
          severity="success"
          onClose={handleCloseAlert}
          sx={{ width: '100%' }}
        >
          <AlertTitle>Thank You!</AlertTitle>
          Your message has been sent!
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
