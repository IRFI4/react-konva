import { KonvaEventObject } from "konva/lib/Node"
import { Tool } from "../types"

export const useMouseArea = ({tool}:{tool:Tool}) => {
    
    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if(tool == Tool.GRAB) return
    }

    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        
    }

    const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        
    }

    return { onMouseDown, onMouseMove, onMouseUp }
}