import Shape, { shapeDimensions } from "../Shape/Shape"
import { SHAPES } from "../../../App";
import { useDrop } from "react-dnd";
import { moveShapeAroundCanvas, replaceShapeOnCanvas } from "../Dashboard";

const CanvasBlock = ({ blockId, setCanvasList, itemToReplace, canvasList, setItemToReplace, setNewItem, setItemToReplaceId, itemToReplaceId, newItem, socket, gameID }) => {
    const shape = canvasList.find(s => s.blockId === blockId);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'shape',
        drop: (item) => addShapeToCanvasList(item, item.id),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }), [itemToReplace]);

    const addShapeToCanvasList = (item, id) => {
        const newShape = SHAPES.filter(shape => shape.id === id);
        newShape[0] = { ...newShape[0], blockId: blockId };
        socket.emit('accept_canvas_data', newShape[0], itemToReplace, item, gameID);
        setCanvasList(prevShapes => {
            let res = null;
            if(item.blockId !== undefined) {
                res = !itemToReplace ? moveShapeAroundCanvas(prevShapes, newShape[0], item) : replaceShapeOnCanvas(prevShapes, itemToReplace, item, newShape[0]);
                return [...res];
            }
            return itemToReplace ? [...prevShapes] : [...prevShapes, newShape[0]];
        })
    };

    const getShape = () => {
        if (shape) {
            return <Shape key={shape.blockId} shape={shape} setItemToReplace={setItemToReplace} setNewItem={setNewItem} blockId={shape.blockId} setItemToReplaceId={setItemToReplaceId} />;
        }
    }

    return <div ref={drop} style={{ width: shapeDimensions.width, height: shapeDimensions.height, border: '2px solid #000' }}>{getShape()}</div>
};

export default CanvasBlock;