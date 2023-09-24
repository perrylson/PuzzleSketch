import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { Log } from "../types"
import axios, { AxiosError } from "axios"

export function useFetchLogs({
  options,
}: {
  options?: UseQueryOptions<Log[], AxiosError, Log[], QueryKey>
} = {}) {
  const fetchGameLogs = async (): Promise<Log[]> => {
    const getResponse = await axios.get("http://localhost:8080/logs")
    return getResponse.data
  }
  return useQuery<Log[], AxiosError>({
    queryKey: ["logs"],
    queryFn: fetchGameLogs,
    ...options,
  })
}
