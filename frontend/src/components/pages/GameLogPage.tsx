import { useFetchLogs } from "../../hooks/useFetchLogs"
import { useEffect, useState } from "react"
import { Log } from "../../types"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button, Spinner } from "@material-tailwind/react"
import { DeleteLogsDialog } from "../gamelog/DeleteLogsDialog"
import { useDeleteLogs } from "../../hooks/useDeleteLogs"
type GameLogPageProps = {
  onClick?: () => void
}

export function GameLogPage({ onClick }: GameLogPageProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const handleOpen = () => setDialogOpen(!isDialogOpen)

  const { data, isLoading, isError, isSuccess, error } = useFetchLogs({
    options: { retry: 2 },
  })

  const fetchErrorResponse = error?.response?.data as ErrorResponse
  const fetchErrorDataMessage =
    error && fetchErrorResponse && fetchErrorResponse.errorMessage
      ? fetchErrorResponse.errorMessage
      : "Unknown"
  const logData = data ? data : []

  const {
    mutate,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    isLoading: isDeleteLoading,
    error: deleteError,
  } = useDeleteLogs()

  const deleteErrorResponse = deleteError?.response?.data as ErrorResponse
  const deleteErrorDataMessage =
    deleteError && deleteErrorResponse && deleteErrorResponse.errorMessage
      ? deleteErrorResponse.errorMessage
      : "Unknown"

  const columnHelper = createColumnHelper<Log>()
  const defaultColumns = [
    columnHelper.accessor("username", {
      header: "Username",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("isWin", {
      header: "Win/Loss",
      cell: (info) => (info.getValue() == 1 ? "Win" : "Loss"),
      footer: (info) => info.column.id,
    }),
  ]
  type ErrorResponse = {
    errorMessage?: string
  }
  const [columns] = useState(() => [...defaultColumns])

  /*
  const mockData: Log[] = [
    { username: "test user1", isWin: 0 },
    { username: "test user2", isWin: 1 },
    { username: "test user3", isWin: 1 },
  ]
  */

  const deleteGameLogStatusMessage: Record<string, string> = {
    loading: "Deleting game logs...",
    success: "Successfully deleted game logs.",
    error: "Error: Unable to delete game logs.",
  }

  const table = useReactTable({
    data: logData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (logData.length < 1) {
      setDialogOpen(false)
    }
  }, [logData.length])

  return (
    <div className="grid place-items-center bg-[#DDFFE7] min-h-screen min-w-screen">
      <div className="grid gap-8 py-5 text-center">
        <h1 className="text-center text-4xl font-semibold">Game Log</h1>
        <div>
          <div
            className={`h-60 ${
              isLoading || isError || logData.length < 1
                ? ""
                : "overflow-y-scroll bg-gray-100"
            } w-[800px]`}
          >
            {isLoading && (
              <div className="flex gap-2 items-center justify-center">
                <p>Fetching data...</p>
                <Spinner className="h-10 w-10" />
              </div>
            )}
            {isError && (
              <div className="grid gap-1 text-red-500">
                <p>Error: Unable to fetch data.</p>
                <p>{`Error Message: ${fetchErrorDataMessage}`}</p>
              </div>
            )}
            {isSuccess && (
              <>
                {logData.length < 1 ? (
                  <div className="text-center">
                    <p>No data!</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="sticky top-0 m-0">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              className="text-center border border-solid border-y-0 text-white bg-teal-800"
                              key={header.id}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td
                              className="bg-white border border-solid text-black text-left pl-3 py-5"
                              key={cell.id}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </div>
        <div className="h-16">
          {isDeleteLoading && (
            <div className="flex gap-2 items-center">
              <p>{deleteGameLogStatusMessage["loading"]}</p>
              <Spinner className="h-10 w-10" />
            </div>
          )}
          {isDeleteError && (
            <div className="grid gap-1 justify-center text-red-500">
              <p>{deleteGameLogStatusMessage["error"]}</p>
              <p>{`Error Message: ${deleteErrorDataMessage}`}</p>
            </div>
          )}
          {isDeleteSuccess && deleteGameLogStatusMessage["success"]}
        </div>

        <div className="grid gap-3 px-[340px]">
          <Button
            className="normal-case"
            disabled={isLoading || (isSuccess && logData.length < 1) || isError}
            color="teal"
            onClick={handleOpen}
            size="sm"
          >
            Delete Logs
          </Button>
          <Button
            className="normal-case"
            color="teal"
            onClick={onClick}
            size="sm"
          >
            Home
          </Button>
        </div>
      </div>
      <DeleteLogsDialog
        onClick={() => {
          mutate(void 0)
          handleOpen()
        }}
        isDialogOpen={isDialogOpen}
        handleOpen={handleOpen}
      />
    </div>
  )
}
