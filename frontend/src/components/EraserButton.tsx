import { IconButton } from "@material-tailwind/react"
import { useState, useEffect } from "react"
import { BsFillEraserFill } from "react-icons/bs"
import React from "react"
import { ReactSketchCanvasRef } from "react-sketch-canvas"
type EraserButtonProps = {
  canvasRef?: React.RefObject<ReactSketchCanvasRef>
}

export function EraserButton({ canvasRef }: EraserButtonProps) {
  const [isEraserActive, setEraserActive] = useState(false)

  useEffect(() => {
    canvasRef?.current?.eraseMode(isEraserActive)
  }, [isEraserActive, canvasRef])

  return (
    <IconButton
      size="sm"
      onClick={() => {
        setEraserActive(!isEraserActive)
      }}
      className={isEraserActive ? "bg-teal-300" : "bg-black"}
    >
      <BsFillEraserFill />
    </IconButton>
  )
}
