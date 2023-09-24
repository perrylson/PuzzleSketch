import { Button, Input } from "@material-tailwind/react"
import { ChangeEvent } from "react"
import { useState } from "react"
export type StartPageProps = {
  usernameHandler: (a: string) => void
  setPage: (a: string) => void
}

export function StartPage({ usernameHandler, setPage }: StartPageProps) {
  const [isUsernameError, setUsernameError] = useState(false)
  const [usernameText, setUsernameText] = useState("")

  return (
    <div className="grid place-items-center bg-[#DDFFE7] min-h-screen min-w-screen">
      <div className="flex flex-col gap-10">
        <h1 className="text-7xl font-semibold text-center">Puzzle Sketch</h1>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-col gap-2 items-center h-20">
            <div className="w-72">
              <Input
                error={isUsernameError}
                color="black"
                label="Username"
                aria-label="username-input"
                maxLength={16}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setUsernameText(event.target.value)
                }}
              />
            </div>
            {isUsernameError ? (
              <p className="text-red-600 text-center text-base">
                Username input field cannot be empty.
              </p>
            ) : null}
          </div>
          <div className="grid gap-3 px-56">
            <Button
              className="normal-case"
              color="teal"
              size="sm"
              onClick={() => {
                if (usernameText === "") {
                  setUsernameError(true)
                } else {
                  usernameHandler(usernameText)
                  setUsernameError(false)
                }
              }}
            >
              Play
            </Button>
            <Button
              color="teal"
              className="normal-case"
              size="sm"
              onClick={() => setPage("history")}
            >
              Game Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
