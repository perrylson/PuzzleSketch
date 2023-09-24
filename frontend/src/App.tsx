import { Main } from "./components/Main"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  )
}

export default App
