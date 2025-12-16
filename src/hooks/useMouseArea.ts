import type { KonvaEventObject } from "konva/lib/Node"
import { ShapeType, Tool, type Shape } from "../types"
import { getRelativePointerPosition } from "../helpers/getRelativePointerPosition"

interface MouseAreaProps {
    tool: Tool
    appendShape: (shape: Shape) => void
}

export const useMouseArea = ({tool, appendShape}: MouseAreaProps) => {
    
    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if(tool == Tool.GRAB) return
         const stage = e.target.getStage()
         const pos = getRelativePointerPosition(stage)
         
         if(!pos) return

         const shapeID = Date.now().toString()

         if(tool == Tool.TEXT) {
            const shape:Shape = {
                id: shapeID,
                type: ShapeType.TEXT,
                x: pos.x,
                y: pos.y,
                text: "Text",
                fontSize: 20,
            }
            appendShape(shape)
         }
    }

    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        
    }

    const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        
    }

    return { onMouseDown, onMouseMove, onMouseUp }
}