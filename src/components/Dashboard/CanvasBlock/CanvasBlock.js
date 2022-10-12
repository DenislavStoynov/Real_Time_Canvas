import Shape, { shapeDimensions } from "../Shape/Shape"
import { SHAPES } from "../../../App";
import { useDrop } from "react-dnd";
import { useEffect } from "react";

const CanvasBlock = ({ blockId, setCanvasList, itemToReplace, canvasList, setItemToReplace, setNewItem, setItemToReplaceId, itemToReplaceId, newItem, socket, gameID }) => {

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'shape',
        drop: (item) => addShapeToCanvasList(item, item.id, item.type),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }), [itemToReplace]);

    const addShapeToCanvasList = (item, id, type) => {
        const newShape = SHAPES.filter(shape => shape.id === id);
        // if(item.blockId) {

        // }
        newShape[0] = { id: id, type: type, blockId: blockId };
        socket.emit('accept_canvas_data', newShape[0], itemToReplace, gameID);
        setCanvasList(prevShapes => {
            return itemToReplace ? [...prevShapes] : [...prevShapes, newShape[0]];
        });
    };

    const getShape = () => {
        const shape = canvasList.find(s => s.blockId === blockId)
        if (shape) {
            return <Shape key={shape.blockId} shape={shape} prop={'canvasParent'} setItemToReplace={setItemToReplace} setNewItem={setNewItem} counter={shape.blockId} setItemToReplaceId={setItemToReplaceId} />;
        }
    }

    return <div ref={drop} style={{ width: shapeDimensions.width, height: shapeDimensions.height, border: '2px solid #000', zIndex: '901' }}>{getShape()}</div>
};

export default CanvasBlock;