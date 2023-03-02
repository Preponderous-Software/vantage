import useSWR from 'swr';
import { Users } from '../src/user';
import { fetchWithToken } from '../src/fetchWithToken';

type UseUsersType = {
  isLoading: boolean;
  isError: boolean;
  users: Users;
}

export function useUsers(token: string): UseUsersType {
  const { data, error } = useSWR([`/users`, token], ([url, token]) => fetchWithToken(url, token));
  return { users: data, isLoading: !error && !data, isError: error }
}