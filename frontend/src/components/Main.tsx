import { useState } from "react"
import { SketchPage } from "./pages/SketchPage"
import { UsernameContext } from "./UserContext"
import { StartPage } from "./pages/StartPage"
import { GameLogPage } from "./pages/GameLogPage"
export type MainProps = {
  testPage?: string
  testIsUsernameError?: boolean
}

export function Main() {
  const [username, setUserName] = useState<string>("")
  const [page, setPage] = useState<string>("start")
  const checkUsername = (name: string) => {
    if (name != "") {
      setUserName(name)
      setPage("game")
    }
  }
  const pageMap: Record<string, JSX.Element> = {
    start: <StartPage setPage={setPage} usernameHandler={checkUsername} />,
    game: (
      <UsernameContext.Provider value={username}>
        <SketchPage onClick={() => setPage("start")} />
      </UsernameContext.Provider>
    ),
    history: <GameLogPage onClick={() => setPage("start")} />,
  }

  return (
    <div>{page in pageMap ? pageMap[page] : <p>Unknown page: {page} </p>}</div>
  )
}
