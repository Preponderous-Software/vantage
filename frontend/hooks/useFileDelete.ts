import useSWRMutation from 'swr/mutation';
import { mutateWithTokenEmptyResponse } from '../src/fetchWithToken';
import { useMemo } from 'react';
import { FileType } from './useFiles';

type UseFileDeleteType = {
  deleteFile: () => Promise<void>;
  isMutating: boolean;
}

export function useFileDelete(path: string, token: string): UseFileDeleteType {
  const parentPath = useMemo(() => {
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      return path.slice(0, lastSlashIndex);
    } else {
      return ''
    }
  }, [path]);
  const { trigger, isMutating } = useSWRMutation(
    [`/files/${encodeURIComponent(parentPath)}`, token],
    ([url, token]) => mutateWithTokenEmptyResponse(`/files/${encodeURIComponent(path)}`, 'DELETE', undefined, token)
  );
  const deleteFile = async () => {
    await trigger();
  }
  return { deleteFile, isMutating }
}