import './App.css'
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import ToolBar from './components/ToolBar';
import { useTool } from './hooks/useTool';

function App() {
  const { setTool, tool } = useTool()


  return (
    <main className='canvas'> 
      <ToolBar activeTool={tool} onChange={setTool}/>
     <Stage 
      width={window.innerWidth} 
      height={window.innerHeight}
      draggable
      >
      <Layer>
        <Text text="Try to drag shapes" fontSize={15} draggable/>
        <Rect
          x={20}
          y={50}
          width={100}
          height={100}
          fill="red"
          shadowBlur={10}
          draggable
        />
        <Circle
          x={200}
          y={100}
          radius={50}
          fill="green"
          draggable
        />
        </Layer>
      </Stage>
    </main>
  )
}

export default App
