import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const WebSocketContext = createContext(null);

const getSocketUrl = () => {
  const host = process.env.WDS_SOCKET_HOST;
  const port = process.env.WDS_SOCKET_PORT;
  if (!host || !port) {
    return null;
  }
  return `wss://${host}:${port}`;
};

export const WebSocketProvider = ({ children }) => {
  const { getIdTokenClaims } = useAuth0();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const authSentRef = useRef(false);
  const readyPromiseRef = useRef(null);
  const listenersRef = useRef(new Set());
  const socketUrl = getSocketUrl();

  const sendAuthFrame = useCallback(async () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return false;
    }
    if (authSentRef.current) {
      return true;
    }
    try {
      const claims = await getIdTokenClaims();
      const token = claims?.__raw;
      if (!token) {
        return false;
      }
      socketRef.current.send(JSON.stringify({ auth: { token } }));
      authSentRef.current = true;
      return true;
    } catch (err) {
      console.error('Failed to attach auth token for websocket.', err);
      return false;
    }
  }, [getIdTokenClaims]);

  useEffect(() => {
    if (!socketUrl) {
      return;
    }
    const ws = new WebSocket(socketUrl);
    socketRef.current = ws;
    authSentRef.current = false;
    readyPromiseRef.current = new Promise((resolve) => {
      ws.onopen = async () => {
        const authed = await sendAuthFrame();
        setIsConnected(true);
        resolve(authed);
      };
      ws.onerror = () => {
        resolve(false);
      };
    });
    ws.onclose = () => {
      setIsConnected(false);
    };
    ws.onmessage = (event) => {
      listenersRef.current.forEach((handler) => handler(event));
    };
    return () => {
      ws.close();
    };
  }, [socketUrl, sendAuthFrame]);

  const sendJson = useCallback(async (payload) => {
    if (!socketRef.current || !readyPromiseRef.current) {
      return false;
    }
    const ready = await readyPromiseRef.current;
    if (!ready) {
      return false;
    }
    try {
      socketRef.current.send(JSON.stringify(payload));
      return true;
    } catch (err) {
      console.error('Failed to send websocket payload.', err);
      return false;
    }
  }, []);

  const subscribe = useCallback((handler) => {
    listenersRef.current.add(handler);
    return () => {
      listenersRef.current.delete(handler);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ sendJson, subscribe, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};
