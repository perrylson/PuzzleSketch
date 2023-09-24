import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Log } from "../types"
import axios, { AxiosError } from "axios"

export function useCreateLogData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Log) =>
      await axios.post("http://localhost:8080/logs", JSON.stringify(data), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["logs"])
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (_error: AxiosError) => {
      void 0
    },
  })
}
