import { useDrag, useDrop } from "react-dnd";

export const shapeDimensions = {
    width: 85,
    height: 85
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
            width: shapeDimensions.width * 2,
            height: shapeDimensions.height,
            backgroundColor: '#ffa500'
        }
    };

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'shape',
        item: { id: shape.id, type: shape.type, shapeType: shape },
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

    return <div ref={validate ? drag : drop} style={shapeStyle()} onDrop={updateReplaceData}></div>

};

export default Shape;

// const ref = useRef(null);
// const dndRef = drag(drop(ref));