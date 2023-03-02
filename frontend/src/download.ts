function downloadBlob(fileName: string, value: Blob) {
  const url = window.URL.createObjectURL(value);
  const downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  downloadLink.href = url;
  downloadLink.addEventListener('click', () => document.body.removeChild(downloadLink));
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

export function download(fileName: string, url: string, token: string) {
  fetch(`${process.env.NEXT_PUBLIC_VANTAGE_API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(value => value.blob())
    .then(value => downloadBlob(fileName, value));
}