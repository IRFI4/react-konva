import type { FC } from "react"
import Button from "./Button"
import { type CommonShapeStyle, type Shape, ShapeType, type Text } from "../types"
import type { ShapeStyle } from "../App"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

interface ShapeOptionsProps {
    style: CommonShapeStyle
    onApplyStyles: (styles: Partial<CommonShapeStyle>) => void
    activeShapes: Shape[]
    deleteShapes: () => void
}

const strokeColors = ["white", "red", "black", "blue"]
const backgroundColors = [...strokeColors, "transparent"]
const cornerRadius = [0, 5, 10]

const ShapeOptions: FC<ShapeOptionsProps> = ({
    onApplyStyles,
    activeShapes,
    style,
    deleteShapes,
}) => {
  const textShape = activeShapes.find(
    (shape) => shape.type == ShapeType.TEXT
  ) as Text | undefined

  const options: {
    title: string
    options: ShapeStyle[keyof ShapeStyle][]
    key: keyof ShapeStyle
    type: "color" | "text"
  }[] = [
    {
      title: "Background",
      options: backgroundColors,
      key: "fill",
      type: "color",
    },
    {
      title: "Stroke",
      options: strokeColors,
      key: "stroke",
      type: "color",
    },
    {
      title: "Corner radius",
      options: cornerRadius,
      key: "cornerRadius",
      type: "text",
    },
  ]

  return (
    <menu className="">
      <div className="">
        {options.map((option) => (
          <div key={option.title} className="flex flex-col items-start">
            <b>{option.title}</b>
            <div className="">
              {option.options.map((opt) => {
                return (
                  <Button
                    active={style[option.key] === opt}
                    onClick={() => onApplyStyles({ [option.key]: opt })}
                    key={opt}
                    className={option.type === "color" ? "w-fit p-2" : ""}
                  >
                    {option.type === "color" ? (
                      opt === "transparent" ? (
                        <div
                          style={{ backgroundColor: opt as string }}
                          className=""
                        >
                          x
                        </div>
                      ) : (
                        <div
                          style={{ backgroundColor: opt as string }}
                          className=""
                        />
                      )
                    ) : (
                      opt
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {textShape && (
        <>
          <b className="">Text</b>
          <input
            className="p-2 w-full rounded mt-2"
            value={textShape.text}
            onChange={(e) => onApplyStyles({ text: e.target.value })}
          />
          <b className="">Font size</b>
          <input
            type="number"
            value={textShape.fontSize}
            onChange={(e) =>
              onApplyStyles({ fontSize: Number(e.target.value) })
            }
            className=""
            max={100}
            min={0}
            step={5}
          />
        </>
      )}

      {activeShapes.length > 0 && (
        <Button onClick={deleteShapes} className="">
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      )}
    </menu>
  )
}

export default ShapeOptions