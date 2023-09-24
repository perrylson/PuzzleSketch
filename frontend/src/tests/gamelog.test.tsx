import { describe, expect } from "@jest/globals"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useFetchLogs } from "../hooks/useFetchLogs"
import { useDeleteLogs } from "../hooks/useDeleteLogs"
import { Log } from "../types"
import { GameLogPage } from "../components/pages/GameLogPage"

const mockData: Log[] = [{ username: "test user1", isWin: 0 }]
const mockedMutate = jest.fn()

jest.mock("../hooks/useFetchLogs")

jest.mock("../hooks/useDeleteLogs")

const mockedUseFetchLogs = useFetchLogs as jest.Mock<any>

const mockedUseDeleteLogs = useDeleteLogs as jest.Mock<any>

describe("Game Log", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("Displays a table of the game logs after fetching the data", () => {
    mockedUseFetchLogs.mockReturnValue({
      data: mockData,
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    mockedUseDeleteLogs.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: true,
      isLoading: false,
    })
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <GameLogPage />
      </QueryClientProvider>
    )
    fireEvent.click(screen.getByText("Game Log"))

    expect(screen.getByText(mockData[0].username)).toBeInTheDocument()
    expect(
      screen.getByText(mockData[0].isWin == 0 ? "Loss" : "Win")
    ).toBeInTheDocument()
  })

  it("Displays a loading screen when fetching data", () => {
    mockedUseFetchLogs.mockReturnValue({
      data: mockData,
      isError: false,
      isLoading: true,
      isSuccess: false,
    })

    mockedUseDeleteLogs.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: true,
      isLoading: false,
    })
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <GameLogPage />
      </QueryClientProvider>
    )
    fireEvent.click(screen.getByText("Game Log"))
    expect(screen.getByText("Fetching data...")).toBeInTheDocument()
  })

  it("Displays a error message when fetching fails", () => {
    mockedUseFetchLogs.mockReturnValue({
      data: mockData,
      isError: true,
      isLoading: false,
      isSuccess: false,
    })

    mockedUseDeleteLogs.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: true,
      isLoading: false,
    })
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <GameLogPage />
      </QueryClientProvider>
    )
    fireEvent.click(screen.getByText("Game Log"))
    expect(screen.getByText("Error: Unable to fetch data.")).toBeInTheDocument()
  })

  it("Displays a success message when deleting logs succeed", async () => {
    mockedUseFetchLogs.mockReturnValue({
      data: mockData,
      isError: false,
      isLoading: false,
      isSuccess: true,
    })

    mockedUseDeleteLogs.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: true,
      isLoading: false,
    })

    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <GameLogPage />
      </QueryClientProvider>
    )
    fireEvent.click(screen.getByText("Game Log"))
    fireEvent.click(screen.getByText("Delete Logs"))
    fireEvent.click(screen.getByText("Confirm"))
    expect(mockedMutate).toHaveBeenCalled()

    await waitFor(() => {
      expect(
        screen.getByText("Successfully deleted game logs.")
      ).toBeInTheDocument()
      expect(
        screen.queryByText("Error: Unable to fetch data.")
      ).not.toBeInTheDocument()
    })
  })

  it("Displays an error message when deleting logs fail", async () => {
    mockedUseFetchLogs.mockReturnValue({
      data: mockData,
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    mockedUseDeleteLogs.mockReturnValue({
      mutate: mockedMutate,
      isError: true,
      isSuccess: false,
      isLoading: false,
    })

    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <GameLogPage />
      </QueryClientProvider>
    )
    fireEvent.click(screen.getByText("Game Log"))
    fireEvent.click(screen.getByText("Delete Logs"))
    fireEvent.click(screen.getByText("Confirm"))
    expect(mockedMutate).toHaveBeenCalled()
    await waitFor(() => {
      expect(
        screen.getByText("Error: Unable to delete game logs.")
      ).toBeInTheDocument()
      expect(
        screen.queryByText("Successfully deleted game logs.")
      ).not.toBeInTheDocument()
    })
  })

  it("Displays a loading message during ongoing delete log process", async () => {
    mockedUseFetchLogs.mockReturnValue({
      data: mockData,
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    mockedUseDeleteLogs.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: false,
      isLoading: true,
    })

    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <GameLogPage />
      </QueryClientProvider>
    )
    fireEvent.click(screen.getByText("Game Log"))
    fireEvent.click(screen.getByText("Delete Logs"))
    fireEvent.click(screen.getByText("Confirm"))
    expect(mockedMutate).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByText("Deleting game logs...")).toBeInTheDocument()
      expect(
        screen.queryByText("Successfully deleted game logs.")
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText("Error: Unable to fetch data.")
      ).not.toBeInTheDocument()
    })
  })
})
