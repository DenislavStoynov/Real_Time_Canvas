import './Join.css';
import { useRef, useContext, useEffect } from 'react';
import { UserListContext } from '../../ctx/UserListContext';

const Join = ({ setIsJoined, socket, gameID }) => {
    const user = useRef();
    const { userList, setUserList } = useContext(UserListContext);

    const validateUserInput = (user) => {
        return user.trim().length < 1 ? false : true;
    }

    const joinUser = () => {
        if (!validateUserInput(user.current.value)) throw new Error("Field cannot be blank!");
        socket.emit("join_game", gameID, user.current.value);
        socket.emit("update_users_list", user.current.value);
        setIsJoined(true);
        localStorage.setItem('user', user.current.value);
    };

    useEffect(() => {
        socket.on("add_user", (data) => {
            setUserList(prevUsers => {
                prevUsers.push(data);
                const filteredUsers = [...new Set(prevUsers)];
                return [...filteredUsers];
            })
        });
    }, [socket]);

    return (
        <div className='join-menu'>
            <div className='join-menu_holder'>
                <input type='text' placeholder='Enter username...' ref={user} />
                <button onClick={() => {
                    try {
                        joinUser();
                    } catch (err) {
                        alert(err)
                    }
                }}>Join</button>
            </div>
        </div>
    )
};

export default Join;