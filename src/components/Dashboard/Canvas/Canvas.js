import Shape from "../Shape/Shape";

const Canvas = ({ canvasList, dropRef, setItemToReplace, setNewItem, setItemToReplaceId }) => {
    const pageHeight = window.innerHeight - 131 + 'px';

    const displayShapesOnCanvas = () => {
        return canvasList.map(shape => <Shape key={shape.counter} shape={shape} prop={'canvasParent'} setItemToReplace={setItemToReplace} setNewItem={setNewItem} counter={canvasList.indexOf(shape)} setItemToReplaceId={setItemToReplaceId} />)
    };

    return (
        <div style={{ width: '100%', height: pageHeight, backgroundColor: '#aaa' }} ref={dropRef}>
            {canvasList && <div style={{display: 'flex', flexWrap: 'wrap', gap: 15}}>{displayShapesOnCanvas()}</div>}
        </div>
    )
};

export default Canvas;