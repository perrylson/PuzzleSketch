import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas"
import { IconButton, Button, Select, Option } from "@material-tailwind/react"
import { EraserButton } from "../EraserButton"
import { MdOutlineUndo, MdOutlineRedo } from "react-icons/md"

type SketchSectionProps = {
  canvas: React.RefObject<ReactSketchCanvasRef>
  styles: {
    border: string
    borderRadius: string
  }
  puzzleCanvasWidth: number
  puzzleCanvasLength: number
  color: string
  colorMap: Record<string, string>
  updateColor: (a: string) => void
  difficulty: string
  puzzleCanvasLengthSectionsAmount: number
  puzzleCanvasWidthSectionsAmount: number
  createPuzzle: () => Promise<void>
  onClick?: () => void
  updateDifficulty: (a?: string) => void
}

export function SketchSection({
  canvas,
  styles,
  puzzleCanvasWidth,
  puzzleCanvasLength,
  color,
  colorMap,
  updateColor,
  difficulty,
  puzzleCanvasLengthSectionsAmount,
  puzzleCanvasWidthSectionsAmount,
  createPuzzle,
  onClick,
  updateDifficulty,
}: SketchSectionProps) {
  return (
    <div className="grid gap-3 py-4">
      <h4 className="font-bold text-center">Sketch a picture of the puzzle!</h4>

      <div className="flex justify-center items-center">
        <div className="grid text-center pl-10">
          <div className="flex gap-5 justify-end pb-3">
            <EraserButton canvasRef={canvas} />
            <IconButton
              size="sm"
              className="bg-black"
              onClick={() => canvas.current?.undo()}
            >
              <MdOutlineUndo />
            </IconButton>
            <IconButton
              size="sm"
              className="bg-black"
              onClick={() => canvas.current?.redo()}
            >
              <MdOutlineRedo />
            </IconButton>
          </div>
          <ReactSketchCanvas
            ref={canvas}
            style={styles}
            width={`${puzzleCanvasWidth}px`}
            height={`${puzzleCanvasLength}px`}
            className="shadow border border-solid"
            strokeWidth={4}
            strokeColor={color}
            withViewBox
          />
        </div>
        <div className="grid gap-2 pl-3 pt-10">
          {Object.keys(colorMap).map((key: string) => (
            <Button
              key={key}
              className={`rounded-full !h-8 !w-8 ${colorMap[key]}  ${
                color === key ? "outline !outline-gray-400" : ""
              }`}
              size="sm"
              onClick={() => updateColor(key)}
              title={key}
              children={<p />}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="px-56">
          <Select
            label="Select Difficulty"
            color="green"
            size="md"
            value={difficulty}
            className="shadow"
            onChange={(val) => updateDifficulty(val)}
          >
            <Option className="rounded-none" value="easy">
              Easy
            </Option>
            <Option className="rounded-none" value="medium">
              Medium
            </Option>
            <Option className="rounded-none" value="hard">
              Hard
            </Option>
          </Select>
        </div>
        <p className="font-semibold text-black text-center">
          {`Play with ${
            puzzleCanvasLengthSectionsAmount * puzzleCanvasWidthSectionsAmount
          } tiles`}
        </p>
        <div>
          <div className="flex justify-center">
            <div className="grid gap-1 px-6">
              <Button
                className="normal-case"
                size="sm"
                color="teal"
                onClick={createPuzzle}
              >
                Start Game
              </Button>
              <Button
                className="normal-case"
                size="sm"
                color="teal"
                onClick={onClick}
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
