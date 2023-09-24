import { SketchPage } from "../components/pages/SketchPage"
import "@testing-library/jest-dom"
import { describe, expect } from "@jest/globals"
import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useCreateLogData } from "../hooks/useCreateLogData"

jest.mock("../hooks/useCreateLogData")
const mockedMutate = jest.fn()

const mockedUseCreateLogData = useCreateLogData as jest.Mock<any>

describe("Sketch Page with Sketch Section", () => {
  it("sketch page appears", () => {
    render(<SketchPage />)
    expect(
      screen.getByText("Sketch a picture of the puzzle!")
    ).toBeInTheDocument()
    expect(screen.getByText("Start Game")).toBeInTheDocument()
  })
})

describe("Sketch Page with Game Section", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("Game Section renders", () => {
    mockedUseCreateLogData.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: true,
      isLoading: false,
    })
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <SketchPage gameStarted />
      </QueryClientProvider>
    )
    expect(screen.getByText("Stop Game")).toBeInTheDocument()
  })
  it("Game Section displays a victory message if players win", () => {
    mockedUseCreateLogData.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: true,
      isLoading: false,
    })
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <SketchPage gameStarted gameEnd={{ status: "win" }} />
      </QueryClientProvider>
    )
    expect(screen.getByText("Go back to Start")).toBeInTheDocument()
    expect(screen.getByText("Victory")).toBeInTheDocument()
  })

  it("Game Section displays a defeat message if players loses", () => {
    mockedUseCreateLogData.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: true,
      isLoading: false,
    })
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <SketchPage gameStarted gameEnd={{ status: "loss" }} />
      </QueryClientProvider>
    )
    expect(screen.getByText("Go back to Start")).toBeInTheDocument()
    expect(screen.getByText("Defeat")).toBeInTheDocument()
  })
  it("Game Section displays a success message if game log creation succeeds", async () => {
    mockedUseCreateLogData.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: true,
      isLoading: false,
    })
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <SketchPage gameStarted gameEnd={{ status: "loss" }} />
      </QueryClientProvider>
    )
    expect(screen.getByText("Go back to Start")).toBeInTheDocument()
    expect(mockedMutate).toHaveBeenCalled()
    await waitFor(() => {
      expect(
        screen.queryByText("Error: Unable to save game log.")
      ).not.toBeInTheDocument()

      expect(
        screen.getByText("Successfully saved game log.")
      ).toBeInTheDocument()
    })
  })
  it("Game Section displays a defeat message if players loses", async () => {
    mockedUseCreateLogData.mockReturnValue({
      mutate: mockedMutate,
      isError: true,
      isSuccess: false,
      isLoading: false,
    })
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <SketchPage gameStarted gameEnd={{ status: "loss" }} />
      </QueryClientProvider>
    )
    expect(screen.getByText("Go back to Start")).toBeInTheDocument()
    expect(mockedMutate).toHaveBeenCalled()
    await waitFor(() => {
      expect(
        screen.queryByText("Successfully saved game log.")
      ).not.toBeInTheDocument()

      expect(
        screen.getByText("Error: Unable to save game log.")
      ).toBeInTheDocument()
    })
  })
  it("Game Section displays a loading message during ongoing game log saving process", async () => {
    mockedUseCreateLogData.mockReturnValue({
      mutate: mockedMutate,
      isError: false,
      isSuccess: false,
      isLoading: true,
    })
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <SketchPage gameStarted gameEnd={{ status: "loss" }} />
      </QueryClientProvider>
    )
    expect(screen.getByText("Go back to Start")).toBeInTheDocument()
    expect(mockedMutate).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByText("Saving game log...")).toBeInTheDocument()
      expect(
        screen.queryByText("Successfully saved game log.")
      ).not.toBeInTheDocument()

      expect(
        screen.queryByText("Error: Unable to save game log.")
      ).not.toBeInTheDocument()
    })
  })
})
