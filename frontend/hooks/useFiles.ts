import useSWR from 'swr';
import { fetchWithToken } from '../src/fetchWithToken';

export type FileType = {
  name: string;
  isDirectory: boolean;
}

type UseFilesType = {
  isLoading: boolean;
  isError: boolean;
  files: FileType[];
}

export function useFiles(token: string, path?: string): UseFilesType {
  const { data, error } = useSWR([`/files/${encodeURIComponent(path ?? '')}`, token], ([url, token]) => fetchWithToken(url, token));
  return { files: data?.files, isLoading: !error && !data, isError: error }
}