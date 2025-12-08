const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiFetch(path: string, options: any = {}) {
  const headers = options.headers || {};
  const token = localStorage.getItem('accessToken');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw { status: res.status, body: data };
    return data;
  }
  // return raw
  const blob = await res.blob();
  return blob;
}

export function saveToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function clearToken() {
  localStorage.removeItem('accessToken');
}
