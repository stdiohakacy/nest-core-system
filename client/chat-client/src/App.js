import React, { useEffect, useState } from 'react';
import ChatShell from './containers/shell/ChatShell';
import Login from './containers/login/Login';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios'
import { socket, SocketContext } from "./store/socket/context"

const App = () => {
  const [userProfile, setUserProfile] = useState(null);
  const headers = { 'Authorization': `Bearer ${localStorage.getItem("access-token")}`};

  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/auth/user/profile", { headers })
      .then(response => {setUserProfile(response.data.data)})
      .catch(error => {console.log(error)});
    return () => {
      socket.disconnect(); // Clean up the socket connection when the component unmounts
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route 
          exact 
          path='/chat' 
          element={<ChatShell userProfile={userProfile} /> }
        >
        </Route>
        <Route path='/login' element={<Login/>}></Route>
      </Routes>
    </SocketContext.Provider>
    
  );
}

export default App;
