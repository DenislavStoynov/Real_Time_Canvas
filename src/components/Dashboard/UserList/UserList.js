import { useContext } from "react";
import { UserListContext } from "../../../ctx/UserListContext";
const UserList = () => {
    const { userList } = useContext(UserListContext);
    const extractUsers = () => {
        return userList.length > 0 ? userList.map(user => <p key={Math.random()}>{user}</p>) : null;
    }
    return (
        <div style={{ width: '20%', height: '100%', textAlign: 'center', color: '#fff', backgroundColor: '#656565', overflowY: 'scroll' }}>
            {extractUsers()}
        </div>
    )
};

export default UserList;