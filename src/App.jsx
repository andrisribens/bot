import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton.jsx';
import LogoutButton from './LogoutButton.jsx';
import Profile from './Profile.jsx';
import Chat from './components/chat/Chat.jsx';

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const [showRequests, setShowRequests] = useState(false);
  const [showChat, setShowChat] = useState(true);

  if (isLoading) {
    return (
      <div className="app-container">
          <div className="loading-state">
          <div className="loading-text">Pārlādē...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Oops!</div>
          <div className="error-message">Kaut kas nogāja greizi</div>
          <div className="error-sub-message">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-card-wrapper">
        <h1 className="main-title">Balticovo demo</h1>

        {isAuthenticated ? (
          <div className="logged-in-section">
            <div className="action-buttons">
              <button
                type="button"
                className="button requests"
                onClick={() => {
                  setShowRequests(true);
                  setShowChat(false);
                }}
              >
                PIEPRASĪJUMI
              </button>
              <button
                type="button"
                className="button chat"
                onClick={() => {
                  setShowChat(true);
                  setShowRequests(false);
                }}
              >
                Čats
              </button>
              <LogoutButton />
            </div>
            {showChat ? <Chat /> : null}
            {showRequests ? (
              <div className="requests-table-wrapper">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>datums</th>
                      <th>lietotājs</th>
                      <th>pieprasījums</th>
                      <th>atbilde</th>
                      <th>status</th>
                    </tr>
                  </thead>
                  <tbody />
                </table>
              </div>
            ) : null}
            <div className="profile-card">
              <Profile />
            </div>
          </div>
        ) : (
          <div className="action-card">
            <p className="action-text">Lai uzsāktu, vispirms jāautentificējas</p>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
