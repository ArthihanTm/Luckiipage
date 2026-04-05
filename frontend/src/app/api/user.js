import { authHeaders } from './auth';

async function requestJson(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      data?.message ||
      (data && typeof data === 'object' ? Object.values(data).join('\n') : null) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

/** Current user profile (requires login). */
export async function getMe() {
  return requestJson('/api/v1/me');
}
