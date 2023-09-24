import { describe, expect } from "@jest/globals"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { StartPage } from "../components/pages/StartPage"
describe("Main", () => {
  it("start page appears", () => {
    render(
      <StartPage
        setPage={(a: string) => void a}
        usernameHandler={(a: string) => void a}
      />
    )
    expect(screen.getByText("Puzzle Sketch")).toBeInTheDocument()
  })

  it("username input field rejects empty string", () => {
    render(
      <StartPage
        setPage={(a: string) => void a}
        usernameHandler={(a: string) => void a}
      />
    )
    fireEvent.click(screen.getByText("Play"))
    expect(
      screen.getByText("Username input field cannot be empty.")
    ).toBeInTheDocument()

    expect(screen.getByText("Puzzle Sketch")).toBeInTheDocument()
  })

  it("username input field accepts non-empty string", () => {
    render(
      <StartPage
        setPage={(a: string) => void a}
        usernameHandler={(a: string) => void a}
      />
    )

    fireEvent.change(screen.getByLabelText("username-input"), {
      target: { value: "testUsername" },
    })

    fireEvent.click(screen.getByText("Play"))
    expect(
      screen.queryByText("Username input field cannot be empty.")
    ).not.toBeInTheDocument()
  })
})
