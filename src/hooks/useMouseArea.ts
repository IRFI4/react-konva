import type { KonvaEventObject } from "konva/lib/Node"
import { ShapeType, Tool, type Placement2D, type Shape } from "../types"
import { getRelativePointerPosition } from "../helpers/getRelativePointerPosition"
import { useRef, useState } from "react"
import Konva from "konva"
import { shapeSizing } from "../helpers/shapeSizing"

const initialSelectedArea = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
    startX: 0,
    startY: 0,
}

interface MouseAreaProps {
    tool: Tool
    appendShape: (shape: Shape) => void
}

export const useMouseArea = ({tool, appendShape}: MouseAreaProps) => {
    const [selecterArea, setSelectedArea] = useState(initialSelectedArea)
    const shapePreview = useRef<Shape | null>(null)
    const previewLayerRef = useRef<Konva.Layer | null>(null)
    const mouseDown = useRef(false)

    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if(tool == Tool.GRAB) return
        mouseDown.current = true

         const stage = e.target.getStage()
         const pos = getRelativePointerPosition(stage)
         
        if(e.target !== stage) {
            return
        }

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
        return
        }

        const selecterArea = {
            visible: true,
            startX: pos.x,
            startY: pos.y,
            width: 0,
            height: 0,
            ...pos,
        }

        setSelectedArea(selecterArea)

        let shape: Shape | null = null

        if(tool == Tool.RECTANGLE) {
            shape = {
                id: shapeID,
                type: ShapeType.RECTANGLE,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2,
                ...selecterArea,
            }
        }

        if(tool == Tool.CIRCLE) {
            shape = {
                id: shapeID,
                type: ShapeType.CIRCLE,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2,
                radiusX: 0,
                radiusY: 0,
                ...pos,
            }
        }

        if(tool == Tool.PENCIL) {
            shape = {
                id: shapeID,
                type: ShapeType.LINE,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2,
                points: [pos.x, pos.y],
                ...pos,
            }
        }

        if(!shape) return
        shapePreview.current = shape

        switch (tool) {
            case Tool.RECTANGLE:
                previewLayerRef.current?.add(new Konva.Rect(shape))
                break
            case Tool.CIRCLE:
                previewLayerRef.current?.add(new Konva.Ellipse({...shape, radiusX: 0, radiusY: 0}))
                break
            case Tool.PENCIL:
                previewLayerRef.current?.add(new Konva.Line({...shape, x: 0, y: 0, width: 0, height: 0}))
                break

            default:
                break
        }
    }

    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if(!mouseDown.current) return
        const stage = e.target.getStage()
        const pos = getRelativePointerPosition(stage)
        if(!pos) return
        const {width, height, x, y} = getNewSelectAreaSize(pos, {
            x: selecterArea.startX,
            y: selecterArea.startY,
        })

        const rectSelection = shapeSizing.getRectSize({height, width}, {x, y})

        const shape = shapePreview?.current
        const shapeToEdit = previewLayerRef.current?.findOne(`#${shape?.id }`)

        if(!shapeToEdit || !shape) return

        if(tool == Tool.RECTANGLE) {
            shapeToEdit.setAttrs(rectSelection)
            shapePreview.current = { ...shape, ...rectSelection}
        }
        if(tool == Tool.CIRCLE) {
            const circleSelection = shapeSizing.getEllipseSize(
                {height, width},
                {x, y}
            )
            shapeToEdit.setAttrs(circleSelection)
            shapePreview.current = { ...shape, ...circleSelection}
        }
        if(tool == Tool.PENCIL && shape.type == ShapeType.LINE) {
            const points = shape.points.concat([pos.x, pos.y])
            shape.points = points
            shapeToEdit.setAttrs({ points })
        }

        previewLayerRef.current?.batchDraw()
    }

    const onMouseUp = () => {
        mouseDown.current = false
        if(tool !== Tool.POINTER && tool !== Tool.GRAB) {
            const shape = shapePreview.current 
            if(!shape) return
            const shapeToEdit = previewLayerRef.current?.findOne(`#${shape?.id}`)
            shapeToEdit?.destroy()
            previewLayerRef.current?.batchDraw()
            appendShape(shape)
            shapePreview.current = null
        }
        setSelectedArea(initialSelectedArea)
    }

    return { previewLayerRef, onMouseDown, onMouseMove, onMouseUp }
}

const getNewSelectAreaSize = (start: Placement2D, end: Placement2D) => {
    const width = Math.abs(start.x - end.x)
    const height = Math.abs(start.y - end.y)
    const x = (start.x + end.x) / 2
    const y = (start.y + end.y) / 2

    return {width, height, x, y}
}