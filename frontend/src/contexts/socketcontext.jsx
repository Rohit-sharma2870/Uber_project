import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
export const SocketContext = createContext(null);
export const SocketProvider = ({ children }) => {
  const socketRef = useRef();
  useEffect(() => {
    // connect to backend server
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to server:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

//   🔹 Function to send message to a specific event
  const sendMessage = (eventName, data) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, data);
    }
  };

//   🔹 Function to receive message from a specific event
  const onMessage = (eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  };
  return (
    <SocketContext.Provider value={{ sendMessage, onMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
