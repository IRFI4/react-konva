import type { Placement2D, Size2D } from "../types";

export const shapeSizing = {
    getRectSize: ({height, width}: Size2D, {x, y}: Placement2D) => ({
        width,
        height,
        x: x - width / 2,
        y: y - height / 2
    }),
    getEllipseSize: ({height, width}: Size2D, {x, y}: Placement2D) => ({
        radiusX: width / 2,
        radiusY: height / 2,
        x,
        y,
    }),
}