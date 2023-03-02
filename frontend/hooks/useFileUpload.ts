import { useCallback } from 'react';
import { mutateWithTokenEmptyResponse, uploadFilesWithEmptyResponse } from '../src/fetchWithToken';
import useSWRMutation from 'swr/mutation';

type UseFileUploadType = {
  openFileUploadDialog: () => void;
}

export function useFileUpload(path: string, token: string): UseFileUploadType {
  const { trigger: uploadFile, isMutating } = useSWRMutation(
    [`/files/${encodeURIComponent(path)}`, token],
    ([url, token], { arg: { fileName, formData } }) => uploadFilesWithEmptyResponse(`${url}${(path === '' ? (encodeURIComponent(path) + '%2F') : '') + encodeURIComponent(fileName)}`, 'PUT', formData, token)
  );
  const openFileUploadDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.style.display = 'none';
    input.addEventListener('change', () => {
      const files = input.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      uploadFile({ fileName: file.name, formData });
    });
    input.addEventListener('click', () => {
      document.body.removeChild(input);
    })
    document.body.appendChild(input);
    input.click();
  }, [uploadFile]);
  return { openFileUploadDialog };
}