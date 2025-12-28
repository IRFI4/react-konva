import type { KonvaEventObject } from "konva/lib/Node"
import { ShapeType, Tool, type CommonShapeStyle, type Placement2D, type Shape } from "../types"
import { getRelativePointerPosition } from "../helpers/getRelativePointerPosition"
import { useRef, useState } from "react"
import Konva from "konva"
import { shapeSizing } from "../helpers/shapeSizing"
import type { SelectionBox } from "../helpers/isShapeinSelection"

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
    style: CommonShapeStyle
    appendShape: (shape: Shape) => void
    selectShape: (id: string) => void
    selectShapesInArea: (selectionBox: SelectionBox) => void
}

export const useMouseArea = ({tool, appendShape, selectShape, selectShapesInArea, style}: MouseAreaProps) => {
    const [selectedArea, setSelectedArea] = useState(initialSelectedArea)
    const shapePreview = useRef<Shape | null>(null)
    const previewLayerRef = useRef<Konva.Layer | null>(null)
    const mouseDown = useRef(false)
    const shapeDragging = useRef(false)

    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if(tool == Tool.GRAB) return
        mouseDown.current = true

         const stage = e.target.getStage()
         const pos = getRelativePointerPosition(stage)
         
        if(e.target !== stage) {
            const shapeID = e.target.attrs.id
            selectShape(shapeID)
            shapeDragging.current = true
            return
        } else {
            selectShape("")
        }

        if(!pos) return

         const shapeID = Date.now().toString()

        if(tool == Tool.TEXT) {
        const shape:Shape = {
            id: shapeID,
            type: ShapeType.TEXT,
            x: pos.x,
            y: pos.y,
            ...style,
        }
        appendShape(shape)
        return
        }

        const selectedArea = {
            visible: true,
            startX: pos.x,
            startY: pos.y,
            width: 0,
            height: 0,
            ...pos,
        }

        setSelectedArea(selectedArea)

        let shape: Shape | null = null

        if(tool == Tool.RECTANGLE) {
            shape = {
                id: shapeID,
                type: ShapeType.RECTANGLE,
                ...style,
                ...selectedArea,
            }
        }

        if(tool == Tool.CIRCLE) {
            shape = {
                id: shapeID,
                type: ShapeType.CIRCLE,
                ...style,
                radiusX: 0,
                radiusY: 0,
                ...selectedArea,
            }
        }

        if(tool == Tool.PENCIL) {
            shape = {
                id: shapeID,
                type: ShapeType.LINE,
                ...style,
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
        if(!mouseDown.current || shapeDragging.current) return
        const stage = e.target.getStage()
        const pos = getRelativePointerPosition(stage)
        if(!pos) return
        const {width, height, x, y} = getNewSelectAreaSize(pos, {
            x: selectedArea.startX,
            y: selectedArea.startY,
        })

        const rectSelection = shapeSizing.getRectSize({height, width}, {x, y})

        if(tool == Tool.POINTER) {
            setSelectedArea({ ...selectedArea, ...rectSelection})
            selectShapesInArea(rectSelection)
            return
        }

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
        shapeDragging.current = false
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

    return { selectedArea, previewLayerRef, onMouseDown, onMouseMove, onMouseUp }
}

const getNewSelectAreaSize = (start: Placement2D, end: Placement2D) => {
    const width = Math.abs(start.x - end.x)
    const height = Math.abs(start.y - end.y)
    const x = (start.x + end.x) / 2
    const y = (start.y + end.y) / 2

    return {width, height, x, y}
}