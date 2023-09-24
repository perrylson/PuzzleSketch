import { ReactSketchCanvasRef } from "react-sketch-canvas"
import { useRef, useState } from "react"
import { GameSection } from "../game/GameSection"
import { SketchSection } from "../game/SketchSection"
import { PuzzlePiece } from "../../types"

function shuffleArray(array: PuzzlePiece[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

type SketchPageProps = {
  onClick?: () => void
  gameStarted?: boolean
  gameEnd?:
    | {
        status: "win" | "loss"
      }
    | undefined
}

export function SketchPage({
  onClick,
  gameStarted,
  gameEnd,
}: SketchPageProps = {}) {
  const puzzleCanvasLength = 300
  const puzzleCanvasWidth = 300

  const tileDifficulty: Record<string, { length: number; width: number }> = {
    easy: { length: 150, width: 150 },
    medium: { length: 75, width: 75 },
    hard: { length: 30, width: 30 },
  }

  const [difficulty, setDifficulty] = useState("medium")
  const [color, setColor] = useState("black")
  const [hasGameStarted, setHasGameStarted] = useState(
    gameStarted ? gameStarted : false
  )

  const mockedPiece: PuzzlePiece = {
    sx: 0,
    sy: 0,
    index: 0,
    dx: 0,
    dy: 0,
    height: 10,
    width: 10,
    visible: true,
  }

  const [puzzlePieceArray, setPuzzlePieceArray] = useState<PuzzlePiece[]>(
    gameStarted ? [mockedPiece] : []
  )
  const [puzzlePieceBoardArray, setPuzzlePieceBoardArray] = useState<
    PuzzlePiece[]
  >(gameStarted ? [mockedPiece] : [])

  const puzzleTileWidth = tileDifficulty[difficulty].width
  const puzzleTileLength = tileDifficulty[difficulty].length
  const puzzleCanvasWidthSectionsAmount = puzzleCanvasWidth / puzzleTileWidth
  const puzzleCanvasLengthSectionsAmount = puzzleCanvasLength / puzzleTileLength

  const [imageData, setImageData] = useState("")
  const canvas = useRef<ReactSketchCanvasRef>(null)
  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
  }
  const colorMap: Record<string, string> = {
    black: "bg-black",
    green: "bg-green-500",
    red: "bg-red-500",
    teal: "bg-teal-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  }

  const createPuzzle = async () => {
    const imageData = await canvas.current?.exportImage("png")

    setPuzzlePieceArray([])
    setPuzzlePieceBoardArray([])
    let index = 0

    for (let sy = 0; sy < puzzleCanvasWidth; sy += puzzleTileWidth) {
      for (let sx = 0; sx < puzzleCanvasLength; sx += puzzleTileLength) {
        puzzlePieceArray.push({
          sx,
          sy,
          index,
          dx: 0,
          dy: 0,
          height: puzzleTileLength,
          width: puzzleTileWidth,
          visible: true,
        })
        puzzlePieceBoardArray.push({
          sx,
          sy,
          index,
          dx: 0,
          dy: 0,
          height: puzzleTileLength,
          width: puzzleTileWidth,
          visible: false,
        })
        index += 1
      }
    }
    setImageData(imageData ? imageData : "")
    shuffleArray(puzzlePieceArray)

    let dx = 0
    let dy = 0
    for (let i = 0; i < puzzlePieceArray.length; i++) {
      puzzlePieceArray[i].dx = dx
      puzzlePieceArray[i].dy = dy
      puzzlePieceBoardArray[i].dx = dx
      puzzlePieceBoardArray[i].dy = dy

      if (dx >= puzzleCanvasLength - puzzleTileLength) {
        dx = 0
        dy += puzzleTileWidth
      } else {
        dx += puzzleTileLength
      }
    }

    setPuzzlePieceArray(puzzlePieceArray)
    setPuzzlePieceBoardArray(puzzlePieceBoardArray)
    setHasGameStarted(true)
  }

  return (
    <div className="grid place-items-center bg-[#DDFFE7] min-h-screen min-w-screen">
      {hasGameStarted ? (
        <GameSection
          imageData={imageData}
          puzzlePieceArray={puzzlePieceArray}
          puzzlePieceBoardArray={puzzlePieceBoardArray}
          puzzleTileLength={puzzleTileLength}
          puzzleTileWidth={puzzleTileWidth}
          puzzleCanvasLength={puzzleCanvasLength}
          puzzleCanvasWidth={puzzleCanvasWidth}
          onClick={onClick}
          gameEnd={gameEnd}
        />
      ) : (
        <SketchSection
          canvas={canvas}
          styles={styles}
          puzzleCanvasLength={puzzleCanvasLength}
          puzzleCanvasWidth={puzzleCanvasWidth}
          puzzleCanvasLengthSectionsAmount={puzzleCanvasLengthSectionsAmount}
          puzzleCanvasWidthSectionsAmount={puzzleCanvasWidthSectionsAmount}
          color={color}
          colorMap={colorMap}
          difficulty={difficulty}
          createPuzzle={createPuzzle}
          updateColor={(a: string) => {
            setColor(a)
          }}
          onClick={onClick}
          updateDifficulty={(val?: string) => {
            setDifficulty(val ? val : "")
          }}
        />
      )}
    </div>
  )
}
