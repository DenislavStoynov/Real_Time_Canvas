import './Join.css';
import { useRef, useContext, useEffect, useState } from 'react';
import { UserListContext } from '../../ctx/UserListContext';

const Join = ({ setCanvasList, setIsJoined, socket, gameID }) => {
    const user = useRef();
    const [isUserExists, setIsUserExists] = useState(false);
    const { setUserList } = useContext(UserListContext);

    const validateUserInput = (user) => {
        return user.trim().length < 1 ? false : true;
    }

    const joinUser = () => {
        if (!validateUserInput(user.current.value)) throw new Error("Field cannot be blank!");
        socket.emit("join_game", gameID, user.current.value);
        socket.emit('add_user_to_list', gameID, user.current.value);
        localStorage.setItem('user', user.current.value);
    };
    
    useEffect(() => {
        socket.on('join_room', (data) => {
            if (data.error === undefined) {
                setIsJoined(true);
                setIsUserExists(false);
                setUserList(data.users);
                setCanvasList([]);
            } else {
                setIsUserExists(true);
            }
        })
    }, [socket]);

    return (
        <div className='join-menu'>
            <div className='join-menu_holder'>
                <input type='text' placeholder='Enter username...' ref={user} />
                {isUserExists && <p style={{color: '#ff0000'}}>This user already exists!</p>}
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