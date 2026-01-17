import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.jsx';

const domain =
  process.env.REACT_APP_AUTH0_DOMAIN ||
  (typeof import.meta !== 'undefined' ? import.meta.env.VITE_AUTH0_DOMAIN : undefined);
const clientId =
  process.env.REACT_APP_AUTH0_CLIENT_ID ||
  (typeof import.meta !== 'undefined' ? import.meta.env.VITE_AUTH0_CLIENT_ID : undefined);

if (!domain || !clientId) {
  console.error('Auth0 configuration missing. Please check your .env file.');
  console.error('Required environment variables:');
  console.error('- VITE_AUTH0_DOMAIN or REACT_APP_AUTH0_DOMAIN');
  console.error('- VITE_AUTH0_CLIENT_ID or REACT_APP_AUTH0_CLIENT_ID');
  throw new Error('Auth0 domain and client ID must be set in .env file');
}

if (
  !domain.includes('.auth0.com') &&
  !domain.includes('.us.auth0.com') &&
  !domain.includes('.eu.auth0.com') &&
  !domain.includes('.au.auth0.com')
) {
  console.warn(
    'Auth0 domain format might be incorrect. Expected format: your-domain.auth0.com'
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
