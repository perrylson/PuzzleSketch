import { Button } from "@material-tailwind/react"
import { useState, useRef, useEffect, useContext, useCallback } from "react"
import { FinishGameDialog } from "./FinishGameDialog"
import { HealthController } from "../HealthController"
import { PuzzlePiece } from "../../types"
import { useCreateLogData } from "../../hooks/useCreateLogData"
import { UsernameContext } from "../UserContext"

type GameSectionProps = {
  imageData: string
  puzzlePieceArray: PuzzlePiece[]
  puzzlePieceBoardArray: PuzzlePiece[]
  puzzleTileLength: number
  puzzleTileWidth: number
  puzzleCanvasLength: number
  puzzleCanvasWidth: number
  onClick?: () => void
  gameEnd?: {
    status: "win" | "loss"
  }
  heartAmount: number
}

type Tile = {
  actualPosition: number
  boardPosition: number
}

type ErrorResponse = {
  errorMessage?: string
}

export function GameSection({
  puzzlePieceArray,
  puzzlePieceBoardArray,
  puzzleTileLength,
  puzzleTileWidth,
  puzzleCanvasLength,
  puzzleCanvasWidth,
  onClick,
  imageData,
  gameEnd,
  heartAmount,
}: GameSectionProps) {
  const [isGameFinished, setIsGameFinished] = useState(false)
  const [gameResult, setGameResult] = useState("loss")
  const maxPlayerHealth = heartAmount
  const [currentPlayerHealth, setCurrentPlayerHealth] =
    useState(maxPlayerHealth)
  const [puzzleTileAmount, setPuzzleTileAmount] = useState(
    puzzlePieceBoardArray.length
  )
  const [selectedTile, setSelectedTile] = useState<Tile>({
    actualPosition: -1,
    boardPosition: -1,
  })

  const username = useContext(UsernameContext)
  const { mutate, isSuccess, isError, isLoading, error } = useCreateLogData()

  const createErrorResponse = error?.response?.data as ErrorResponse
  const createErrorDataMessage =
    error && createErrorResponse && createErrorResponse.errorMessage
      ? createErrorResponse.errorMessage
      : "Unknown"

  const [isCanvasEventListenersAttached, setIsCanvasEventListenersAttached] =
    useState(false)

  const [playerPuzzlePieceArray, setPlayerPuzzlePieceArray] = useState<
    PuzzlePiece[]
  >(puzzlePieceArray ? puzzlePieceArray : [])
  const [playerPuzzlePieceBoardArray, setPlayerPuzzlePieceBoardArray] =
    useState<PuzzlePiece[]>(puzzlePieceBoardArray ? puzzlePieceBoardArray : [])
  const puzzleCanvas = useRef<HTMLCanvasElement>(null)
  const gameBoardCanvas = useRef<HTMLCanvasElement>(null)

  const selectedTileRef = useRef(selectedTile)
  const playerPuzzlePieceArrayRef = useRef(playerPuzzlePieceArray)
  const playerPuzzlePieceBoardArrayRef = useRef(playerPuzzlePieceBoardArray)

  const currentPlayerHealthRef = useRef(currentPlayerHealth)
  const puzzleTileAmountRef = useRef(puzzleTileAmount)

  const increasePlayerHealth = function (
    maxPlayerHealth: number,
    currentPlayerHealth: number
  ) {
    if (currentPlayerHealth < maxPlayerHealth) {
      setCurrentPlayerHealth(currentPlayerHealth + 1)
    } else {
      setCurrentPlayerHealth(maxPlayerHealth)
    }
  }

  const decreasePlayerHealth = function (currentPlayerHealth: number) {
    if (currentPlayerHealth > 0) {
      setCurrentPlayerHealth(currentPlayerHealth - 1)
    } else {
      setCurrentPlayerHealth(0)
    }
  }

  const [isDialogOpen, setDialogOpen] = useState(false)
  const handleOpen = () => setDialogOpen(!isDialogOpen)

  const firstCanvasEvent = useCallback((e: MouseEvent) => {
    const canvas = puzzleCanvas.current
    if (canvas) {
      const recX = canvas.getBoundingClientRect().x
      const recY = canvas.getBoundingClientRect().y
      const x = e.clientX - recX
      const y = e.clientY - recY

      for (let i = 0; i < playerPuzzlePieceArrayRef.current.length; i += 1) {
        if (
          y > playerPuzzlePieceArrayRef.current[i].dy &&
          y <
            playerPuzzlePieceArrayRef.current[i].dy +
              playerPuzzlePieceArrayRef.current[i].height &&
          x > playerPuzzlePieceArrayRef.current[i].dx &&
          x <
            playerPuzzlePieceArrayRef.current[i].dx +
              playerPuzzlePieceArrayRef.current[i].width
        ) {
          if (playerPuzzlePieceArrayRef.current[i].visible) {
            setSelectedTile({
              actualPosition: playerPuzzlePieceArrayRef.current[i].index,
              boardPosition: i,
            })
          } else {
            setSelectedTile({
              actualPosition: -1,
              boardPosition: -1,
            })
          }
        }
      }
    }
  }, [])

  const secondCanvasEvent = useCallback(
    (e: MouseEvent) => {
      const canvas2 = gameBoardCanvas.current

      if (canvas2) {
        const x = e.clientX - canvas2.getBoundingClientRect().x
        const y = e.clientY - canvas2.getBoundingClientRect().y
        if (selectedTileRef.current.actualPosition !== -1) {
          for (
            let i = 0;
            i < playerPuzzlePieceBoardArrayRef.current.length;
            i += 1
          ) {
            if (
              y > playerPuzzlePieceBoardArrayRef.current[i].dy &&
              y <
                playerPuzzlePieceBoardArrayRef.current[i].dy +
                  playerPuzzlePieceBoardArrayRef.current[i].height &&
              x > playerPuzzlePieceBoardArrayRef.current[i].dx &&
              x <
                playerPuzzlePieceBoardArrayRef.current[i].dx +
                  playerPuzzlePieceBoardArrayRef.current[i].width
            ) {
              if (!playerPuzzlePieceBoardArray[i].visible) {
                if (
                  selectedTileRef.current.actualPosition ===
                  playerPuzzlePieceBoardArrayRef.current[i].index
                ) {
                  playerPuzzlePieceBoardArray[i].visible = true
                  playerPuzzlePieceArray[
                    selectedTileRef.current.boardPosition
                  ].visible = false
                  increasePlayerHealth(
                    maxPlayerHealth,
                    currentPlayerHealthRef.current
                  )
                  setPuzzleTileAmount(puzzleTileAmountRef.current - 1)
                } else {
                  decreasePlayerHealth(currentPlayerHealthRef.current)
                }
              }
            }
          }
        }

        setSelectedTile({ actualPosition: -1, boardPosition: -1 })
        setPlayerPuzzlePieceArray(playerPuzzlePieceArray)
        setPlayerPuzzlePieceBoardArray(playerPuzzlePieceBoardArray)
      }
    },
    [playerPuzzlePieceArray, playerPuzzlePieceBoardArray]
  )

  const checkPlayerStatus = useCallback(() => {
    if (currentPlayerHealthRef.current <= 0 || gameEnd?.status === "loss") {
      setIsGameFinished(true)
      mutate({ username, isWin: 0 })
      setDialogOpen(true)
    } else if (puzzleTileAmountRef.current === 0 || gameEnd?.status === "win") {
      setGameResult("win")
      setIsGameFinished(true)
      mutate({ username, isWin: 1 })
      setDialogOpen(true)
    }
  }, [gameEnd?.status, mutate, username])

  useEffect(() => {
    if (!isGameFinished) {
      const ctx = puzzleCanvas?.current?.getContext("2d")
      const gbCtx = gameBoardCanvas?.current?.getContext("2d")
      if (ctx) {
        ctx.lineWidth = 10
      }

      currentPlayerHealthRef.current = currentPlayerHealth
      puzzleTileAmountRef.current = puzzleTileAmount
      selectedTileRef.current = selectedTile
      playerPuzzlePieceArrayRef.current = playerPuzzlePieceArray
      playerPuzzlePieceBoardArrayRef.current = playerPuzzlePieceBoardArray
      checkPlayerStatus()

      const img = new Image()
      img.src = imageData
      img.onload = () => {
        let dx = 0
        let dy = 0

        for (let i = 0; i < playerPuzzlePieceArrayRef.current.length; i++) {
          const puzzlePiece = playerPuzzlePieceArrayRef.current[i]
          if (puzzlePiece.visible) {
            ctx?.drawImage(
              img,
              puzzlePiece.sx,
              puzzlePiece.sy,
              puzzleTileLength,
              puzzleTileWidth,
              dx,
              dy,
              puzzleTileLength,
              puzzleTileWidth
            )
          } else {
            ctx?.clearRect(dx, dy, puzzleTileLength, puzzleTileWidth)
          }
          if (selectedTileRef.current.boardPosition === i) {
            if (ctx) {
              ctx.globalAlpha = 0.5
              ctx.fillStyle = "red"
              ctx.fillRect(dx, dy, puzzleTileLength, puzzleTileWidth)
            }
          }
          if (ctx) {
            ctx.globalAlpha = 1.0
            ctx.strokeStyle = `rgb(
            0,
            150,
            136)`
          }
          ctx?.strokeRect(dx, dy, puzzleTileLength, puzzleTileWidth)

          if (dx >= puzzleCanvasLength - puzzleTileLength) {
            dx = 0
            dy += puzzleTileWidth
          } else {
            dx += puzzleTileLength
          }
        }

        dx = 0
        dy = 0

        for (
          let i = 0;
          i < playerPuzzlePieceBoardArrayRef.current.length;
          i++
        ) {
          const puzzleBoardPiece = playerPuzzlePieceBoardArrayRef.current[i]

          if (puzzleBoardPiece.visible) {
            gbCtx?.drawImage(
              img,
              puzzleBoardPiece.sx,
              puzzleBoardPiece.sy,
              puzzleTileLength,
              puzzleTileWidth,
              puzzleBoardPiece.dx,
              puzzleBoardPiece.dy,
              puzzleTileLength,
              puzzleTileWidth
            )
          }
          if (gbCtx) {
            gbCtx.strokeStyle = `rgb(
            0,
            150,
            136)`
          }
          gbCtx?.strokeRect(
            puzzleBoardPiece.dx,
            puzzleBoardPiece.dy,
            puzzleTileLength,
            puzzleTileWidth
          )

          if (dx >= puzzleCanvasLength - puzzleTileLength) {
            dx = 0
            dy += puzzleTileWidth
          } else {
            dx += puzzleTileLength
          }
        }
      }

      const canvas = puzzleCanvas.current
      const canvas2 = gameBoardCanvas.current

      if (canvas && canvas2) {
        if (!isCanvasEventListenersAttached) {
          canvas.addEventListener("click", firstCanvasEvent)

          canvas2.addEventListener("click", secondCanvasEvent)
          setIsCanvasEventListenersAttached(true)
        }
      }
    }
    return () => {
      removeEventListener("click", firstCanvasEvent)
      removeEventListener("click", secondCanvasEvent)
    }
  }, [
    selectedTile,
    playerPuzzlePieceArray,
    playerPuzzlePieceBoardArray,
    imageData,
    currentPlayerHealth,
    puzzleTileAmount,
    mutate,
    gameEnd?.status,
    puzzleCanvasLength,
    puzzleTileLength,
    puzzleTileWidth,
    username,
    isCanvasEventListenersAttached,
    checkPlayerStatus,
    firstCanvasEvent,
    secondCanvasEvent,
    isGameFinished,
  ])

  return (
    <div className="grid py-4">
      <div className="flex items-center justify-between pt-3">
        <div>
          <img
            className="pl-12"
            width={200}
            height={200}
            src={imageData}
            alt="puzzle-image"
          ></img>
        </div>
        <div>
          <HealthController
            maxPlayerHealth={maxPlayerHealth}
            currentPlayerHealth={currentPlayerHealth}
          />
        </div>
      </div>
      <div className="flex gap-12">
        <div>
          <div className="p-4">
            <canvas
              aria-disabled={isGameFinished}
              ref={puzzleCanvas}
              width={puzzleCanvasWidth}
              height={puzzleCanvasLength}
              className="border-teal-500 border-4 border-solid rounded-none"
            />
          </div>
        </div>
        <div>
          <div className="p-4">
            <canvas
              aria-disabled={isGameFinished}
              ref={gameBoardCanvas}
              width={puzzleCanvasWidth}
              height={puzzleCanvasLength}
              className="border-teal-500 border-2 border-solid rounded-none"
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        <Button
          className="normal-case"
          size="sm"
          color="teal"
          onClick={onClick}
        >
          {isGameFinished ? "Go Back to Start" : "Stop Game"}
        </Button>
      </div>
      <FinishGameDialog
        gameResult={gameResult}
        isDialogOpen={isDialogOpen}
        handleOpen={handleOpen}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        createErrorDataMessage={createErrorDataMessage}
        onClick={onClick}
      />
    </div>
  )
}
