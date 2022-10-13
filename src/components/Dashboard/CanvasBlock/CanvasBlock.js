import Shape, { shapeDimensions } from "../Shape/Shape"
import { SHAPES } from "../../../App";
import { useDrop } from "react-dnd";
import { useEffect } from "react";

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
            if (item.blockId !== undefined && !itemToReplace) {
                const updateShapes = prevShapes.map(u => {
                    if(u.blockId === item.blockId) {
                        newShape[0].id = u.id;
                        newShape[0].type = u.type;
                        const item2 = {...newShape[0]};
                        u = item2;
                    }
                    return u;
                })
                return [...updateShapes];
            }
            if(item.blockId !== undefined && itemToReplace) {
                const updateShapes = prevShapes.filter(u => u.blockId != itemToReplace.blockId).map(u => {
                    if(u.blockId === item.blockId) {u.blockId = newShape[0].blockId}
                    return u;
                });
                return [...updateShapes];
            }
            return itemToReplace ? [...prevShapes] : [...prevShapes, newShape[0]];
        })
    };

    const getShape = () => {
        if (shape) {
            // zamenqm v canvas lista no ne zamenqm
            return <Shape key={shape.blockId} shape={shape} prop={'canvasParent'} setItemToReplace={setItemToReplace} setNewItem={setNewItem} blockId={shape.blockId} setItemToReplaceId={setItemToReplaceId} />;
        }
    }

    return <div ref={drop} style={{ width: shapeDimensions.width, height: shapeDimensions.height, border: '2px solid #000'}} onDrop={()=>{if(shape){return true}}}>{getShape()}</div>
};

export default CanvasBlock;