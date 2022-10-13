import CanvasBlock from "../CanvasBlock/CanvasBlock";
import Shape from "../Shape/Shape";
import { useEffect } from "react";

const Canvas = ({ canvasList, setCanvasList, itemToReplace, setItemToReplace, newItem, setNewItem, itemToReplaceId, setItemToReplaceId, socket, gameID }) => {
    const pageHeight = window.innerHeight - 131;
    const canvasWidth = window.innerWidth;
    const totalBlocks = Math.floor(canvasWidth / 90) * Math.floor(pageHeight / 90);

    const getAllBlocks = () => {
        const canvasBlockArr = [];
        for (let i = 0; i < totalBlocks; i++) {
            canvasBlockArr.push(i);
        }
        return canvasBlockArr;
    }

    return (
        <div style={{ width: '100%', height: pageHeight + 'px', backgroundColor: '#aaa', overflowY: 'scroll' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', zIndex: 999 }}>
                {getAllBlocks().map(item => <CanvasBlock key={item} canvasList={canvasList} blockId={item} setCanvasList={setCanvasList} setItemToReplace={setItemToReplace} itemToReplace={itemToReplace} setNewItem={setNewItem} setItemToReplaceId={setItemToReplaceId} socket={socket} gameID={gameID} itemToReplaceId={itemToReplaceId} newItem={newItem} />)}
            </div>
        </div>
    )
};

export default Canvas;