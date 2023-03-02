import useSWR, { KeyedMutator } from 'swr';
import { fetchWithToken } from '../src/fetchWithToken';
import { Server } from '../src/server'

type UseServerType = {
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<Server>;
  server: Server
}

export function useServer(token: string): UseServerType {
  const { data, error, mutate } = useSWR(['/server', token], ([url, token]) => fetchWithToken(url, token));
  return { server: data, isLoading: !error && !data, isError: error, mutate }
}
