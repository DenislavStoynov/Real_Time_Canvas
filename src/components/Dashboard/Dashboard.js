import { useState, useContext, useEffect } from "react";
import { UserListContext } from "../../ctx/UserListContext";
import UserList from "./UserList/UserList";
import { SHAPES } from "../../App";
import Shape from "./Shape/Shape";
import Canvas from "./Canvas/Canvas";
import LogoutButton from "./LogoutButton/LogoutButton";

export const moveShapeAroundCanvas = (shapeList, nItem, oItem) => {
    const updateShapes = shapeList.map(u => {
        if (u.blockId === oItem.blockId) {
            nItem.id = u.id;
            nItem.type = u.type;
            const item = { ...nItem };
            u = item;
        }
        return u;
    });
    return updateShapes;
};

export const replaceShapeOnCanvas = (shapeList, itp, oItem, nItem) => {
    const updateShapes = shapeList
        .filter(u => u.blockId != itp.blockId)
        .map(u => { if (u.blockId === oItem.blockId) u.blockId = nItem.blockId; return u; });
    return updateShapes;
};

const Dashboard = ({ canvasList, setCanvasList, setIsJoined, socket, gameID }) => {
    const { userList } = useContext(UserListContext);
    const [itemToReplace, setItemToReplace] = useState(null);
    const [itemToReplaceId, setItemToReplaceId] = useState(null);
    const [newItem, setNewItem] = useState(null);

    const sendDataToServer = (new_item, item_to_replace, item_to_replace_ID) => {
        return {
            new_item,
            item_to_replace,
            item_to_replace_ID,
            gameID,
        };
    };

    const updateCanvas = (new_item, item_to_replace_ID) => {
        const new_item_copy = new_item;
        setCanvasList(prevShapes => {
            const updatedShapeList = prevShapes.map((s) => {
                if (s.blockId === item_to_replace_ID) {
                    if (new_item_copy.blockId !== undefined) {
                        new_item_copy.id = s.id;
                        new_item_copy.type = s.type;
                    }
                    const item = {
                        id: new_item_copy.id,
                        type: new_item_copy.type,
                        blockId: item_to_replace_ID
                    };
                    s = item;
                };
                return s;
            });
            return [...updatedShapeList];
        });
    }

    useEffect(() => {
        if (newItem && itemToReplaceId !== undefined) {
            socket.emit('accept_data', sendDataToServer(newItem, itemToReplace, itemToReplaceId));
            updateCanvas(newItem, itemToReplaceId);
            setNewItem(null);
            setItemToReplace(null)
            setItemToReplaceId(null);
        }
    }, [newItem, itemToReplace, itemToReplaceId])

    useEffect(() => {
        socket.off("receive_canvas_data").on("receive_canvas_data", (data, item_to_replace, item) => {
            setCanvasList(prevShapes => {
                let res = null;
                if (item.blockId !== undefined) {
                    res = !item_to_replace ? moveShapeAroundCanvas(prevShapes, data, item) : replaceShapeOnCanvas(prevShapes, item_to_replace, item, data);
                    return [...res];
                }
                return item_to_replace ? [...prevShapes] : [...prevShapes, data]
            });
        });

        socket.on("receive_data", async (data) => {
            const shapesData = await data;
            if (shapesData.new_item !== undefined && shapesData.item_to_replace) {
                updateCanvas(shapesData.new_item, shapesData.item_to_replace_ID)
            };
        });

    }, [socket])

    useEffect(() => {
        if (userList.length < 2) setCanvasList([]);
    }, [userList])

    const extractShapes = () => {
        return userList.length > 1 ?
            SHAPES.map(shape => <Shape key={shape.id} shape={shape} setNewItem={setNewItem} />) :
            <h1 style={{ color: "#fff", textAlign: 'center' }}>Waiting for another player...</h1>;
    };

    return (
        <div>
            <div style={{ display: 'flex', width: '100%', height: '125px', borderBottom: '5px solid #fff' }}>
                <UserList />
                <div id='shapes' style={{ width: '80%', display: 'flex', justifyContent: 'space-evenly', margin: 'auto 0' }}>
                    {extractShapes()}
                    <LogoutButton socket={socket} setIsJoined={setIsJoined} setCanvasList={setCanvasList} />
                </div>
            </div>
            <Canvas canvasList={canvasList} itemToReplace={itemToReplace} setCanvasList={setCanvasList}
                setItemToReplace={setItemToReplace} setNewItem={setNewItem}
                setItemToReplaceId={setItemToReplaceId} socket={socket} gameID={gameID} itemToReplaceId={itemToReplaceId} newItem={newItem} />
        </div>
    )
};

export default Dashboard;