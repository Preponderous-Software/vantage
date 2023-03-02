import useSWR from 'swr';
import { fetchWithToken } from '../src/fetchWithToken';

type UseServerLogType = {
  isLoading: boolean;
  isError: boolean;
  log: string[];
}

export function useServerLog(token: string): UseServerLogType {
  const { data, error } = useSWR(['/server/log', token], ([url, token]) => fetchWithToken(url, token));
  return { log: data?.log, isLoading: !error && !data, isError: !!error}
}