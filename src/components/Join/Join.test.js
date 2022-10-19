import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Join from "./Join";
import io from 'socket.io-client';
import { UserListContextProvider } from '../../ctx/UserListContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const socket = io.connect("http://localhost:3001");

test('renders join component', () => {
    render(<DndProvider backend={HTML5Backend}><UserListContextProvider><Join socket={socket} /></UserListContextProvider></DndProvider>);

    const joinButton = screen.getByText('Join', { exact: true });
    expect(joinButton).toBeInTheDocument();
})

test('should not display any errors when after Join component is mounted', () => {
    render(<DndProvider backend={HTML5Backend}><UserListContextProvider><Join socket={socket} /></UserListContextProvider></DndProvider>);
    const paragraphs = screen.queryAllByRole('p');
    expect(paragraphs.length).toBe(0);
})

test('should display error message if input is blank', () => {
    render(<DndProvider backend={HTML5Backend}><UserListContextProvider><Join socket={socket} /></UserListContextProvider></DndProvider>);
    const joinButton = screen.getByRole('button');
    userEvent.click(joinButton);
    const errorMessage = screen.getByText('Field cannot be blank!');
    expect(errorMessage).toBeInTheDocument();
})