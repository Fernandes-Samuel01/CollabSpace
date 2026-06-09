import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [connected, setConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setSocketInstance(null);
      setConnected(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setSocketInstance(null);
      setConnected(false);
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
      setConnected(false);
    });

    socketRef.current = socket;
    setSocketInstance(socket);

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocketInstance(null);
      setConnected(false);
    };
  }, [isAuthenticated, loading]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);

  if (!ctx) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return ctx;
};