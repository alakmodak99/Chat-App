
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './Pages/Home';
import io from 'socket.io-client'
import { useState } from 'react';
import Chat from './Pages/Chat';
const socket = io.connect('http://localhost:8080');
function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  
  return (
   <BrowserRouter>
     <div className="App">
      <Routes>
        <Route path='/' element={<Home 
        username={username}
        setUsername={setUsername}
        room={room}
        setRoom={setRoom}
        socket={socket}
        />
        }
        />
        <Route path='/chat' element={<Chat
        username={username}
        room={room}
        socket={ socket }/>}/>
      </Routes>
      
   </div>
   </BrowserRouter>
  );
}

export default App;
