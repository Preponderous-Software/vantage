import useSWR from "swr"
import { fetchWithToken } from '../src/fetchWithToken';

type UseBrandType = {
  isLoading: boolean;
  isError: boolean;
  brand?: {
    serverName: string
  }
}

export function useBrand(token?: string): UseBrandType {
  const { data, error } = useSWR(['/brand', token], ([url, token]) => fetchWithToken(url, token));
  return { brand: data, isLoading: !error && !data, isError: error }
}