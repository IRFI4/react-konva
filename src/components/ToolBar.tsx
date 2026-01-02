import type { FC } from "react"
import { Tool } from "../types"
import {
    faMousePointer,
    faHand,
    faFont,
    faPencil
} from "@fortawesome/free-solid-svg-icons"
import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "./Button"

interface ToolBarProps {
    activeTool: Tool
    onChange: (tool: Tool) => void
}

const ToolBar: FC<ToolBarProps> = ({activeTool, onChange}) => {
    const tools = [
        {
            id: Tool.POINTER,
            icon: faMousePointer,
        },
        {
            id: Tool.GRAB,
            icon: faHand,
        },
        {
            id: Tool.RECTANGLE,
            icon: faSquare,
        },
        {
            id: Tool.CIRCLE,
            icon: faCircle,
        },
        {
            id: Tool.TEXT,
            icon: faFont,
        },
        {
            id: Tool.PENCIL,
            icon: faPencil,
        }
    ]

  return (
    <menu className="tool-bar-wrapper">
        <div className="tool-bar">
            {tools.map((option, i) => {
            return (
                <Button
                    onClick={() => onChange(option.id)}
                    active={option.id == activeTool}
                    key={option.id}
                    className="tool-btn"
                >
                    <FontAwesomeIcon icon={option.icon} />
                    <span>{i + 1}</span>
                </Button>
            )
        })}
        </div>
    </menu>
  )
}

export default ToolBar