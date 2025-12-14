import { useState, useEffect } from "react"
import { Tool } from "../types"

export const useTool = () => {
    const [tool, setTool] = useState<Tool>(Tool.POINTER)

    useEffect(() => {
        const handleKeyDown = (e:KeyboardEvent) => {
            switch (e.key) {
                case '1':
                    setTool(Tool.POINTER)
                    break
                case '2':
                    setTool(Tool.GRAB)
                    break
                case '3':
                    setTool(Tool.RECTANGLE)
                    break
                case '4':
                    setTool(Tool.CIRCLE)
                    break
                case '5':
                    setTool(Tool.TEXT)
                    break
                case '6':
                    setTool(Tool.PENCIL)
                    break

                default: 
                break
            }   
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }

    }, [])

    return { tool, setTool }
}