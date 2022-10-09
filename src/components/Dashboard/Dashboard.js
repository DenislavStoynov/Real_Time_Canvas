import { useState, useContext, useEffect } from "react";
import { UserListContext } from "../../ctx/UserListContext";
import UserList from "./UserList/UserList";
import { SHAPES } from "../../App";
import Shape from "./Shape/Shape";
import Canvas from "./Canvas/Canvas";
import { useDrop } from "react-dnd";

const Dashboard = ({ setIsJoined, socket, gameID }) => {
    const [change, setChange] = useState(false);
    const [canvasList, setCanvasList] = useState([]);
    const [itemToReplace, setItemToReplace] = useState(null);
    const [itemToReplaceId, setItemToReplaceId] = useState(null);
    const [newItem, setNewItem] = useState(null);
    const { setUserList } = useContext(UserListContext);
    const user = localStorage.getItem('user');

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

    const leaveRoom = () => {
        setUserList(prevState => prevState.filter(u => u != user));
        setIsJoined(false);
        localStorage.clear();
    };

    const sendDataToServer = (new_item, item_to_replace, item_to_replace_ID) => {
        return {
            new_item,
            item_to_replace,
            item_to_replace_ID,
            gameID,
        };
    };

    useEffect(() => {
        if (newItem && itemToReplace) {
            socket.emit('accept_data', sendDataToServer(newItem, itemToReplace, itemToReplaceId));
            setChange(true);
            setCanvasList(prevShapes => {
                const updatedShapeList = prevShapes.map((s, idx) => {
                    if (s === itemToReplace && idx === itemToReplaceId) {
                        const item = {
                            id: newItem.id,
                            type: newItem.type,
                            counter: Math.random()
                        };
                        s = item
                    };
                    return s;
                });
                updatedShapeList.pop();
                return [...updatedShapeList];
            });
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
                setCanvasList(prevShapes => {
                    const updatedShapeList = prevShapes.map((s, idx) => {
                        if (idx === shapesData.item_to_replace_ID) {
                            const item = {
                                id: shapesData.new_item.id,
                                type: shapesData.new_item.type,
                                counter: Math.random()
                            };
                            s = item
                        };
                        return s;
                    });
                    updatedShapeList.pop();
                    return [...updatedShapeList];
                })
            };
        });
    }, [socket])

    const extractShapes = () => {
        return SHAPES.map(shape => <Shape key={shape.id} shape={shape} prop={'dashboardParent'} setNewItem={setNewItem} />)
    }

    return (
        <div>
            <div style={{ display: 'flex', width: '100%', height: '125px', borderBottom: '5px solid #fff' }}>
                <UserList />
                <div id='shapes' style={{ width: '80%', display: 'flex', justifyContent: 'space-evenly', margin: 'auto 0' }} onClick={() => { console.log(canvasList) }}>
                    {extractShapes()}
                    <button onClick={leaveRoom}>Leave</button>
                </div>
            </div>
            <Canvas canvasList={canvasList} dropRef={drop} setItemToReplace={setItemToReplace} setNewItem={setNewItem} setItemToReplaceId={setItemToReplaceId} />
        </div>
    )
};

export default Dashboard;