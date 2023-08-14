'use client';

export function query(method: string, path: string, body?: any) {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };

  if (localStorage.getItem('token')) {
    headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  return fetch(`${window.location.origin}/api/${path}`, {
    method,
    body: body && JSON.stringify(body),
    headers,
  }).then(resp => resp.json());
}
