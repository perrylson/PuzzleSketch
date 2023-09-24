import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react"

export function FinishGameDialog({
  gameResult,
  isDialogOpen,
  handleOpen,
  isLoading,
  isSuccess,
  isError,
  createErrorDataMessage,
  onClick,
}: {
  gameResult: string
  isDialogOpen: boolean
  handleOpen: () => void
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  createErrorDataMessage: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
  const playerMessage: Record<string, { header: string }> = {
    win: {
      header: "Victory",
    },
    loss: {
      header: "Defeat",
    },
  }

  const gameLogStatusMessage: Record<string, string> = {
    loading: "Saving game log...",
    success: "Successfully saved game log.",
    error: "Error: Unable to save game log.",
  }
  const selectedPlayerMessage = playerMessage[gameResult]

  return (
    <Dialog open={isDialogOpen} handler={handleOpen} size="sm">
      <DialogHeader className="justify-center">
        {selectedPlayerMessage.header}
      </DialogHeader>
      <DialogBody divider className="grid gap-2 text-center">
        {isLoading && (
          <div className="flex gap-2 items-center justify-center">
            <p>{gameLogStatusMessage["loading"]}</p>
            <Spinner className="h-10 w-10" />
          </div>
        )}
        {isSuccess && <p>{gameLogStatusMessage["success"]}</p>}
        {isError && (
          <div className="grid gap-1 text-red-500">
            <p>{gameLogStatusMessage["error"]}</p>
            <p>{`Error Message: ${createErrorDataMessage}`}</p>
          </div>
        )}
      </DialogBody>
      <DialogFooter className="justify-between">
        <Button
          className="normal-case mr-1"
          variant="text"
          color="red"
          onClick={handleOpen}
        >
          Close Dialog
        </Button>
        <Button
          className="normal-case"
          variant="gradient"
          color="green"
          onClick={onClick}
        >
          Go back to Start
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
