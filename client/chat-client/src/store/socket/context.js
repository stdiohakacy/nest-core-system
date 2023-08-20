import React from 'react';
import io from "socket.io-client"; 

export const socket = io("http://localhost:3000", { 
    transports: ['websocket'], 
    autoConnect: true, 
    query: { token: localStorage.getItem("access-token") || "" }
});

export const SocketContext = React.createContext();