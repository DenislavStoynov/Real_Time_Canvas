import { useEffect } from "react";
import { UserListContext } from "../../../ctx/UserListContext";
import { useContext } from "react";

const LogoutButton = ({ socket, setIsJoined }) => {

    const { setUserList } = useContext(UserListContext);
    const user = localStorage.getItem('user');

    const leaveRoom = () => {
        socket.emit("leave_game", 'game1', user);
        setIsJoined(false);
        localStorage.clear();
    };

    useEffect(() => {
        socket.on('remove_user_from_list', (users) => {
            setUserList(users);
        });
    }, [socket]);


    return <button onClick={leaveRoom}>Logout</button>
};

export default LogoutButton;