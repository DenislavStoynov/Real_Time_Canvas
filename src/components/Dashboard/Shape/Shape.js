import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";

export const shapeDimensions = {
    width: 90,
    height: 90
};

const Shape = ({ shape, prop, setItemToReplace, setNewItem, blockId, setItemToReplaceId }) => {

    const validate = prop === 'dashboardParent';

    const shapeStyle = () => {
        if (shape.type === 'circle') return {
            ...shapeDimensions,
            backgroundColor: '#ff0000',
            borderRadius: '50%'
        }
        if (shape.type === 'square') return {
            ...shapeDimensions,
            backgroundColor: '#00ff00'
        }
        return {
            width: shapeDimensions.width,
            height: shapeDimensions.height,
            backgroundColor: '#ffa500'
        }
    };

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'shape',
        item: { id: shape.id, type: shape.type, blockId: blockId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'shape',
        drop: (item) => setNewItem(item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        })
    }));

    const updateReplaceData = () => {
        if (shape.blockId !== undefined) {
            setItemToReplace(shape);
            setItemToReplaceId(blockId);
        }
    };

    const ref = useRef(null);
    const dndRef = drag(drop(ref));

    return <div ref={dndRef} style={shapeStyle()} onDrop={updateReplaceData} onDragStart={()=>{console.log(console.log(shape))}}></div>

};

export default Shape;
