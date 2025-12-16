import './App.css'
import { Stage, Layer } from 'react-konva';
import ToolBar from './components/ToolBar';
import Shapes from './components/Shapes';
import { useTool } from './hooks/useTool';
import { type Shape, ShapeType, Tool } from './types';
import { useStageScale } from './hooks/useStageScale';
import { useMouseArea } from './hooks/useMouseArea';
import { useState } from 'react';

function App() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const { setTool, tool } = useTool()

  const appendShape = (shape: Shape) => {
    setShapes((prev) => [...prev, shape])
  }

  const { onWheel, stagePos, stageScale } = useStageScale()
  const { ...handlers } = useMouseArea({ tool, appendShape })

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
        <Shapes shapes={shapes} tool={tool} />

        </Layer>
      </Stage>
    </main>
  )
}

export default App
