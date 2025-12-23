import type { FC } from "react"
import { ShapeType, type Shape, Tool } from "../types"
import { Rect, Circle, Text, Line } from "react-konva"
import type { KonvaEventObject } from "konva/lib/Node"

interface ShapesProps {
  shapes: Shape[]
  tool: Tool
  onDragEnd: (e: KonvaEventObject<MouseEvent>) => void
}

const Shapes: FC<ShapesProps> = ({shapes, tool, onDragEnd}) => {
  const common = {
    draggable: tool == Tool.POINTER,
    onDragEnd
  }
  return shapes.map((shape) => {
    const activeProps = shape.selected ? {shadowColor: "red", shadowBlur: 20, shadowOpacity: 100} : {}
    const props = { ...common, ...shape, ...activeProps }
      switch(shape.type) {
        case ShapeType.RECTANGLE:
          return <Rect key={shape.id} {...props} />
        case ShapeType.CIRCLE:
          return <Circle key={shape.id} {...props} width={shape.radiusX * 2} height={shape.radiusY * 2} />
        case ShapeType.TEXT:
          return <Text key={shape.id} {...props} text={`${shape.x}, ${shape.y}`}/>
        case ShapeType.LINE:
          return <Line key={shape.id} {...props} x={0} y={0}/>
        default: 
          return null
      }
    })
}

export default Shapes