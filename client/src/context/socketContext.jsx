import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([])
  const [notifications, setNotifications] = useState([])
  // const {currentUser} = useSelector(state => state.auth)

  useEffect(() => {
    // console.log("connecting to socket...");
    setSocket(io(import.meta.env.VITE_APP_SOCKET_URL));
  }, []);
  // console.log(socket)

  return (
    <SocketContext.Provider value={{socket, onlineUsers, setOnlineUsers, notifications, setNotifications}}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider
