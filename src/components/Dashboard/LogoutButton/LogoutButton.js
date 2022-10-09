import { useEffect } from "react";
import { UserListContext } from "../../../ctx/UserListContext";
import { useContext } from "react";

const LogoutButton = ({ socket, setIsJoined }) => {

    const { setUserList } = useContext(UserListContext);
    const user = localStorage.getItem('user');

    const leaveRoom = () => {
        socket.emit("get_removed_user", user);
        socket.emit("leave_game", 'game1', user);
        setIsJoined(false);
        localStorage.clear();
    };

    useEffect(() => {
        socket.on('remove_user', (users) => {
            setUserList(prevState => prevState.filter(u => u != users))
        });
    }, [socket]);


    return <button onClick={leaveRoom}>Logout</button>
};

export default LogoutButton;