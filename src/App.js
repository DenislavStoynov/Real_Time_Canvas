import logo from './logo.svg';
import './canvas.css';
import Join from './components/Join/Join';
import { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import { UserListContextProvider } from './ctx/UserListContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

export const SHAPES = [
  {
    id: 1,
    type: 'circle'
  },
  {
    id: 2,
    type: 'square'
  },
  {
    id: 3,
    type: 'rectangle'
  }
];

const gameID = 'game1';

function App() {
  const [isJoined, setIsJoined] = useState(false);
  const [canvasList, setCanvasList] = useState([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <UserListContextProvider>
        <div className="canvas">
          {!isJoined && <Join setCanvasList={setCanvasList} setIsJoined={setIsJoined} socket={socket} gameID={gameID} />}
          {isJoined && <Dashboard canvasList={canvasList} setCanvasList={setCanvasList} setIsJoined={setIsJoined} socket={socket} gameID={gameID} />}
        </div>
      </UserListContextProvider>
    </DndProvider>
  );
}

export default App;
