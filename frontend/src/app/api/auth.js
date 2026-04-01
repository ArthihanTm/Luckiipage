const TOKEN_KEY = 'luckii_access_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function requestJson(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // Backend sometimes returns {field: message} for validation; stringify nicely.
    const message =
      data?.message ||
      (data && typeof data === 'object' ? Object.values(data).join('\n') : null) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export async function login({ email, password }) {
  const data = await requestJson('/api/v1/auth/authenticate', {
    method: 'POST',
    body: { email, password },
  });
  // Store token for local dev (cookie is Secure=true in backend)
  setToken(data?.access_token);
  return data;
}

export async function register({ email, password }) {
  const data = await requestJson('/api/v1/auth/register', {
    method: 'POST',
    body: { email, password },
  });
  setToken(data?.access_token);
  return data;
}

export async function logout() {
  try {
    await requestJson('/api/v1/auth/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
}

