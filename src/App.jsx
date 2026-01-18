import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton.jsx';
import LogoutButton from './LogoutButton.jsx';
import Profile from './Profile.jsx';
import Chat from './components/chat/Chat.jsx';
import { useWebSocket } from './components/websocket/WebSocketContext.jsx';

function App() {
  const { isAuthenticated, isLoading, error, user } = useAuth0();
  const { sendJson, subscribe, isConnected } = useWebSocket();
  const [showRequests, setShowRequests] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState(null);
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestsTotalCount, setRequestsTotalCount] = useState(0);
  const requestsPageSize = 10;

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.operation !== 'list_messages') {
          return;
        }
        const records = extractRequests(payload);
        setRequests(records);
        setRequestsTotalCount(
          Number.isFinite(payload.total_count) ? payload.total_count : 0
        );
        setRequestsLoading(false);
      } catch (err) {
        setRequestsError('Neizdevās ielādēt pieprasījumus.');
        setRequestsLoading(false);
      }
    });
    return unsubscribe;
  }, [subscribe]);

  const extractRequests = (payload) => {
    if (!payload || typeof payload !== 'object') {
      return [];
    }
    return Array.isArray(payload.data) ? payload.data : [];
  };

  const requestMessages = (page = 1) => {
    setRequestsError(null);
    setRequestsLoading(true);
    const payload = {
      author: user?.name || 'You',
      operation: 'list_messages',
      page,
      page_size: requestsPageSize,
    };
    sendJson(payload).then((sent) => {
      if (!sent) {
        setRequestsError(
          isConnected ? 'Trūkst autentifikācijas žetona.' : 'Nav WebSocket savienojuma.'
        );
        setRequestsLoading(false);
      }
    });
  };

  const formatRequestDate = (value) => {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
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
                        <td>{formatRequestDate(item.date)}</td>
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
                <div className="requests-footer">
                  <div className="requests-total">Kopā: {requestsTotalCount}</div>
                  <div className="requests-pagination">
                    <button
                      type="button"
                      className="button requests pagination"
                      onClick={() => {
                        const nextPage = Math.max(1, requestsPage - 1);
                        setRequestsPage(nextPage);
                        requestMessages(nextPage);
                      }}
                      disabled={requestsLoading || requestsPage <= 1}
                    >
                      Iepriekšējā
                    </button>
                    <button
                      type="button"
                      className="button requests pagination"
                      onClick={() => {
                        const maxPage = Math.max(
                          1,
                          Math.ceil(requestsTotalCount / requestsPageSize)
                        );
                        const nextPage = Math.min(maxPage, requestsPage + 1);
                        setRequestsPage(nextPage);
                        requestMessages(nextPage);
                      }}
                      disabled={
                        requestsLoading ||
                        requestsPage >=
                          Math.max(
                            1,
                            Math.ceil(requestsTotalCount / requestsPageSize)
                          )
                      }
                    >
                      Nākamā
                    </button>
                  </div>
                </div>
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
                  setRequestsPage(1);
                  requestMessages(1);
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
