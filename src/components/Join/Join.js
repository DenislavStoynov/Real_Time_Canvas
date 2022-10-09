import './Join.css';
import { useRef, useContext } from 'react';
import { UserListContext } from '../../ctx/UserListContext';

const Join = ({ setIsJoined, socket, gameID }) => {
    const user = useRef();
    const { setUserList } = useContext(UserListContext);

    const validateUserInput = (user) => {
        return user.trim().length < 1 ? false : true;
    }

    const joinUser = () => {
        if (!validateUserInput(user.current.value)) throw new Error("Field cannot be blank!");
        socket.emit("join_game", gameID, user.current.value);
        setIsJoined(true);
        setUserList(prevUsers => { prevUsers.push(user.current.value); return prevUsers; });
        localStorage.setItem('user', user.current.value);
    }

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