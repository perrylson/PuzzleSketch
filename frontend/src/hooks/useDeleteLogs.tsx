import { Log } from "../types"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"

export function useDeleteLogs() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => await axios.delete("http://localhost:8080/logs"),
    onMutate: async () => {
      await queryClient.cancelQueries(["logs"])
    },
    onSuccess: () => {
      const emptyUserData: Log[] = []
      queryClient.setQueryData(["logs"], emptyUserData)
      queryClient.invalidateQueries(["logs"])
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (_error: AxiosError) => {
      void 0
    },
  })
}
