import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";

export const shapeDimensions = {
    width: 90,
    height: 90
};

const Shape = ({ shape, prop, setItemToReplace, setNewItem, counter, setItemToReplaceId }) => {

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
        item: validate ? { id: shape.id, type: shape.type } : {id: shape.id, type: shape.type, blockId: counter},
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
        setItemToReplace(shape);
        setItemToReplaceId(counter);
    };

    const ref2 = useRef(null);
    const dndRef = drag(drop(ref2));

    return <div ref={dndRef} style={shapeStyle()} onDrop={updateReplaceData}></div>

};

export default Shape;
