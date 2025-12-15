import type { FC } from "react"
import { ShapeType, type Shape, Tool } from "../types"
import { Rect, Circle, Text, Line } from "react-konva"

interface ShapesProps {
  shapes: Shape[]
  tool: Tool
}

const Shapes: FC<ShapesProps> = ({shapes, tool}) => {
  const common = {
    draggable: tool == Tool.POINTER,
  }
  return shapes.map((shape) => {
      switch(shape.type) {
        case ShapeType.RECTANGLE:
          return <Rect key={shape.id} {...common} {...shape} />
        case ShapeType.CIRCLE:
          return <Circle key={shape.id} {...common} {...shape} />
        case ShapeType.TEXT:
          return <Text key={shape.id} {...common} {...shape} />
        case ShapeType.LINE:
          return <Line key={shape.id} {...common} {...shape} />
        default: 
          return null
      }
    })
}

export default Shapes