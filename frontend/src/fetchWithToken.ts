export async function fetchWithToken(url: string, token?: string) {
  if (!token) throw new Error('No token');
  return fetch(`${process.env.NEXT_PUBLIC_VANTAGE_API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json());
}

export async function mutateWithToken(url: string, method: string, data?: any, token?: string) {
  if (!token) throw new Error('No token');
  return fetch(`${process.env.NEXT_PUBLIC_VANTAGE_API_URL}${url}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data ? JSON.stringify(data) : null
  }).then(res => res.json());
}

export async function mutateWithTokenEmptyResponse(url: string, method: string, data?: any, token?: string) {
  if (!token) throw new Error('No token');
  return fetch(`${process.env.NEXT_PUBLIC_VANTAGE_API_URL}${url}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data ? JSON.stringify(data) : null
  });
}

export async function uploadFilesWithEmptyResponse(url: string, method: string, formData: FormData, token?: string) {
  if (!token) throw new Error('No token');
  return fetch(`${process.env.NEXT_PUBLIC_VANTAGE_API_URL}${url}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
}
