import type { Placement2D, Shape, Size2D } from "../types";

export type SelectionBox = Placement2D & Size2D

export const isShapeInSelection = (shape: Shape, selectionBox: SelectionBox) => {
    return (
        shape.x >= selectionBox.x &&
        shape.x <= selectionBox.x + selectionBox.width &&
        shape.y >= selectionBox.y && 
        shape.y <= selectionBox.y + selectionBox.height
    )
}

