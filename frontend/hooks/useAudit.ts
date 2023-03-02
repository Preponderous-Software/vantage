import { Audit } from '../src/audit';
import useSWR from 'swr';
import { fetchWithToken } from '../src/fetchWithToken';

type UseAuditType = {
  isLoading: boolean;
  isError: boolean;
  audit: Audit;
}

export function useAudit(token: string, page: number): UseAuditType {
  const { data, error } = useSWR([`/audit/${page}`, token], ([url, token]) => fetchWithToken(url, token));
  return { audit: data, isLoading: !error && !data, isError: error }
}
