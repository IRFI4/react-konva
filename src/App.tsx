import './App.css'
import { Stage, Layer, Rect} from 'react-konva';
import ToolBar from './components/ToolBar';
import Shapes from './components/Shapes';
import { useTool } from './hooks/useTool';
import { type Shape, Tool } from './types';
import { useStageScale } from './hooks/useStageScale';
import { useMouseArea } from './hooks/useMouseArea';
import { useState } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';
import { isShapeInSelection, type SelectionBox } from './helpers/isShapeinSelection';
 
function App() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const { setTool, tool } = useTool()

  const appendShape = (shape: Shape) => {
    setShapes((prev) => [...prev, shape])
  }

  const selectShape = (id: string) => {
    setShapes((prev) => {
      return prev.map((shape) => {
        return { ...shape, selected: shape.id == id}
      })
    })
  }

  const selectShapesInArea = (selectionBox: SelectionBox) => {
    setShapes((prev) => {
      return prev.map((shape) => {
        return {
          ...shape,
          selected: isShapeInSelection(shape, selectionBox),
        }
      })
    })
  }

  const { onWheel, stagePos, stageScale } = useStageScale()
  const { previewLayerRef, selectedArea, ...handlers } = useMouseArea({ tool, appendShape, selectShape, selectShapesInArea})

   const handleShapeDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    const shapeID = e.target.attrs.id

    setShapes((p) => 
      p.map((shape) => 
        shape.id == shapeID
        ? { ...shape, x:e.target.x(), y: e.target.y() }
        : shape
      )
    )
   }

  return (
    <main className='canvas'> 
      <ToolBar activeTool={tool} onChange={setTool}/>
     <Stage 
     {...stagePos}
     {...handlers}
      scale={{x:stageScale, y: stageScale}}
      width={window.innerWidth} 
      height={window.innerHeight}
      draggable={tool == Tool.GRAB}
      style={{cursor : tool == Tool.GRAB ? "grab" : "default"}}
      onWheel={onWheel}
      className='stage'
      >
      <Layer>
        <Shapes onDragEnd={handleShapeDragEnd} shapes={shapes} tool={tool} />
        </Layer>
        <Layer>
          {/* This layer is for selection shapes*/}
          {selectedArea.visible && (
            <Rect 
              {...selectedArea}
              opacity={0.3}
              fill="aqua"
              stroke="blue"
              strokeWidth={1}
            />
          )}
        </Layer>
        <Layer ref={previewLayerRef}>
          {/* This layer is for previewing shape */}
        </Layer>
      </Stage>
    </main>
  )
}

export default App
