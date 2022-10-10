import { useState, useContext, useEffect } from "react";
import { UserListContext } from "../../ctx/UserListContext";
import UserList from "./UserList/UserList";
import { SHAPES } from "../../App";
import Shape from "./Shape/Shape";
import Canvas from "./Canvas/Canvas";
import { useDrop } from "react-dnd";
import LogoutButton from "./LogoutButton/LogoutButton";

const Dashboard = ({ setIsJoined, socket, gameID }) => {
    const { userList } = useContext(UserListContext);
    const [canvasList, setCanvasList] = useState([]);
    const [itemToReplace, setItemToReplace] = useState(null);
    const [itemToReplaceId, setItemToReplaceId] = useState(null);
    const [newItem, setNewItem] = useState(null);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'shape',
        drop: (item) => addShapeToCanvasList(item.id, item.shapeType.type),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        })
    }))

    const addShapeToCanvasList = (id, shapeType) => {
        const newShape = SHAPES.filter(shape => shape.id === id);
        newShape[0] = {
            id: id,
            type: shapeType,
            counter: Math.random()
        };
        socket.emit('accept_canvas_data', newShape[0], gameID);
        setCanvasList(prevShapes => {
            return [...prevShapes, newShape[0]]
        });
    };

    const sendDataToServer = (new_item, item_to_replace, item_to_replace_ID) => {
        return {
            new_item,
            item_to_replace,
            item_to_replace_ID,
            gameID,
        };
    };

    const updateCanvas = (new_item, item_to_replace_ID) => {
        setCanvasList(prevShapes => {
            const updatedShapeList = prevShapes.map((s, idx) => {
                if (idx === item_to_replace_ID) {
                    const item = {
                        id: new_item.id,
                        type: new_item.type,
                        counter: Math.random()
                    };
                    s = item
                };
                return s;
            });
            updatedShapeList.pop();
            return [...updatedShapeList];
        });
    }

    useEffect(() => {
        if (newItem && itemToReplace) {
            socket.emit('accept_data', sendDataToServer(newItem, itemToReplace, itemToReplaceId));
            updateCanvas(newItem, itemToReplaceId);
            setNewItem(null)
            setItemToReplace(null)
            setItemToReplaceId(null);
        }
    }, [newItem, itemToReplace, itemToReplaceId])

    useEffect(() => {
        socket.on("receive_canvas_data", (data) => {
            setCanvasList(prevShapes => {
                return [...prevShapes, data]
            });
        });

        socket.on("receive_data", async (data) => {
            const shapesData = await data;
            if (shapesData.new_item && shapesData.item_to_replace) {
                updateCanvas(shapesData.new_item, shapesData.item_to_replace_ID)
            };
        });

    }, [socket])

    useEffect(() => {
        if(userList.length < 2) setCanvasList([]);
    }, [userList])

    const extractShapes = () => {
        return userList.length > 1 ?
            SHAPES.map(shape => <Shape key={shape.id} shape={shape} prop={'dashboardParent'} setNewItem={setNewItem} />) :
            <h1 style={{ color: "#fff", textAlign: 'center' }}>Waiting for another player...</h1>;
    }

    return (
        <div>
            <div style={{ display: 'flex', width: '100%', height: '125px', borderBottom: '5px solid #fff' }}>
                <UserList />
                <div id='shapes' style={{ width: '80%', display: 'flex', justifyContent: 'space-evenly', margin: 'auto 0' }}>
                    {extractShapes()}
                    <LogoutButton socket={socket} setIsJoined={setIsJoined} />
                </div>
            </div>
            <Canvas canvasList={canvasList} dropRef={drop} setItemToReplace={setItemToReplace} setNewItem={setNewItem} setItemToReplaceId={setItemToReplaceId} />
        </div>
    )
};

export default Dashboard;