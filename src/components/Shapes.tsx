import type { FC } from "react"
import { ShapeType, type Shape, Tool } from "../types"
import { Rect, Text, Line, Ellipse } from "react-konva"
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
    const activeProps = shape.selected ? {shadowColor: "white", shadowBlur: 20, shadowOpacity: 100} : {}
    const props = { ...common, ...shape, ...activeProps }
      switch(shape.type) {
        case ShapeType.RECTANGLE:
          return <Rect 
            key={shape.id} 
            {...props} 
          />
        case ShapeType.CIRCLE:
          return <Ellipse 
            key={shape.id} 
            {...props} 
            radiusX={shape.radiusX * 2}
            radiusY={shape.radiusY * 2}
            width={shape.radiusX * 2} 
            height={shape.radiusY * 2} 
          />
        case ShapeType.TEXT:
          return <Text 
                  key={shape.id}
                  text="text"
                  {...shape}
                   strokeWidth={1}
                  {...common}
                  {...activeProps}
                />
        case ShapeType.LINE:
          return <Line 
                  key={shape.id} 
                  {...props} 
                  x={0} 
                  y={0}
                />
        default: 
          return null
      }
    })
}

export default Shapes