import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton.jsx';
import LogoutButton from './LogoutButton.jsx';
import Profile from './Profile.jsx';
import Chat from './components/chat/Chat.jsx';

function App() {
  const { isAuthenticated, isLoading, error, user } = useAuth0();
  const [showRequests, setShowRequests] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState(null);
  const requestsSocket = useRef(null);
  const socketHost = process.env.WDS_SOCKET_HOST;
  const socketPort = process.env.WDS_SOCKET_PORT;
  const socketUrl = socketHost && socketPort ? `wss://${socketHost}:${socketPort}` : null;

  useEffect(() => {
    return () => {
      if (requestsSocket.current && requestsSocket.current.readyState !== WebSocket.CLOSED) {
        requestsSocket.current.close();
      }
    };
  }, []);

  const extractRequests = (payload) => {
    if (!payload || typeof payload !== 'object') {
      return [];
    }
    return Array.isArray(payload.data) ? payload.data : [];
  };

  const handleRequestsMessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.operation !== 'list_messages') {
        return;
      }
      const records = extractRequests(payload);
      setRequests(records);
      setRequestsLoading(false);
    } catch (err) {
      setRequestsError('Neizdevās ielādēt pieprasījumus.');
      setRequestsLoading(false);
    }
  };

  const requestMessages = () => {
    if (!socketUrl) {
      setRequestsError('Trūkst WebSocket konfigurācijas.');
      setRequestsLoading(false);
      return;
    }
    setRequestsError(null);
    setRequestsLoading(true);
    if (!requestsSocket.current || requestsSocket.current.readyState === WebSocket.CLOSED) {
      requestsSocket.current = new WebSocket(socketUrl);
      requestsSocket.current.onmessage = handleRequestsMessage;
      requestsSocket.current.onerror = () => {
        setRequestsError('Neizdevās ielādēt pieprasījumus.');
        setRequestsLoading(false);
      };
    }
    const sendPayload = () => {
      const payload = {
        author: user?.name || 'You',
        operation: 'list_messages',
        page: 1,
        page_size: 10,
      };
      requestsSocket.current.send(JSON.stringify(payload));
    };
    if (requestsSocket.current.readyState === WebSocket.OPEN) {
      sendPayload();
    } else {
      requestsSocket.current.onopen = sendPayload;
    }
  };

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
                      <th>statuss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((item, index) => (
                      <tr key={`${item.date || item.message || 'row'}-${index}`}>
                        <td>{item.date || ''}</td>
                        <td>{item.user || item.author || ''}</td>
                        <td>{item.message || item.request || item.text || ''}</td>
                        <td>{item.response || item.answer || ''}</td>
                        <td>{item.status || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {requestsLoading ? (
                  <div className="requests-status">Ielādē...</div>
                ) : null}
                {requestsError ? (
                  <div className="requests-status error">{requestsError}</div>
                ) : null}
              </div>
            ) : null}
            <div className="action-buttons">
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
              <button
                type="button"
                className="button requests"
                onClick={() => {
                  setShowRequests(true);
                  setShowChat(false);
                  requestMessages();
                }}
              >
                PIEPRASĪJUMI
              </button>
              <LogoutButton />
            </div>
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
