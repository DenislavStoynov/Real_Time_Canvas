import CanvasBlock from "../CanvasBlock/CanvasBlock";
import Shape from "../Shape/Shape";

const Canvas = ({ canvasList, dropRef, setItemToReplace, setNewItem, setItemToReplaceId, setCanvasList, itemToReplace, socket, gameID, itemToReplaceId, newItem }) => {
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
            {/* {canvasList && <div style={{display: 'flex', flexWrap: 'wrap', gap: 15}}>{displayShapesOnCanvas()}</div>} */}
            <div style={{ display: 'flex', flexWrap: 'wrap', zIndex: 999 }}>
                {getAllBlocks().map(item => <CanvasBlock key={item} canvasList={canvasList} blockId={item} setCanvasList={setCanvasList} setItemToReplace={setItemToReplace} itemToReplace={itemToReplace} setNewItem={setNewItem} setItemToReplaceId={setItemToReplaceId} socket={socket} gameID={gameID} itemToReplaceId={itemToReplaceId} newItem={newItem} />)}
            </div>
        </div>
    )
};

export default Canvas;