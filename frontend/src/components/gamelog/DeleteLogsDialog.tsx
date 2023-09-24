import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react"

export function DeleteLogsDialog({
  onClick,
  handleOpen,
  isDialogOpen,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  handleOpen: () => void
  isDialogOpen: boolean
}) {
  return (
    <Dialog open={isDialogOpen} handler={handleOpen} size="sm">
      <DialogHeader className="justify-center">
        Delete Logs Confirmation
      </DialogHeader>
      <DialogBody divider className="text-center">
        Please confirm that you want to DELETE all game logs.
      </DialogBody>
      <DialogFooter className="justify-between">
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1 normal-case"
        >
          Close
        </Button>
        <Button
          className="normal-case"
          variant="gradient"
          color="green"
          onClick={onClick}
        >
          Confirm
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
