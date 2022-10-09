import { createContext, useState } from "react";

export const UserListContext = createContext();

export const UserListContextProvider = ({ children }) => {
    const [userList, setUserList] = useState([]);

    return (
        <UserListContext.Provider value={{ userList, setUserList }}>
            {children}
        </UserListContext.Provider>
    )
};