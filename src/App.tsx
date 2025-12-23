import './App.css'
import { Stage, Layer } from 'react-konva';
import ToolBar from './components/ToolBar';
import Shapes from './components/Shapes';
import { useTool } from './hooks/useTool';
import { type Shape, Tool } from './types';
import { useStageScale } from './hooks/useStageScale';
import { useMouseArea } from './hooks/useMouseArea';
import { useState } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';
 
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

  const { onWheel, stagePos, stageScale } = useStageScale()
  const { previewLayerRef, ...handlers } = useMouseArea({ tool, appendShape, selectShape})

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
      >
      <Layer>
        <Shapes onDragEnd={handleShapeDragEnd} shapes={shapes} tool={tool} />

        </Layer>
        <Layer ref={previewLayerRef}>
          {/* This layer if for previewing shape */}
        </Layer>
      </Stage>
    </main>
  )
}

export default App
