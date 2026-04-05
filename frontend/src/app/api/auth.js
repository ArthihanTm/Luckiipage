const TOKEN_KEY = 'luckii_access_token';

/** Backend validation errors are often a flat { fieldName: message } map (no `message` key). */
function formatApiError(data, status) {
  if (data == null || typeof data !== 'object') return `HTTP ${status}`;
  if (typeof data.message === 'string' && data.message.trim()) return data.message.trim();
  if (typeof data.error === 'string' && data.status != null) {
    return `${data.error} (${data.status})`;
  }
  const skip = new Set(['timestamp', 'status', 'error', 'path']);
  const fieldErrors = Object.entries(data).filter(
    ([k, v]) => !skip.has(k) && typeof v === 'string' && v.trim(),
  );
  if (fieldErrors.length > 0) {
    return fieldErrors.map(([k, v]) => `${k}: ${v}`).join('\n');
  }
  return `HTTP ${status}`;
}

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

/** Headers for authenticated API calls (Bearer + cookies). */
export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
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

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      /* non-JSON body (e.g. text/plain error from Spring) */
    }
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    if (data && typeof data === 'object') {
      message = formatApiError(data, res.status);
    } else if (text.trim()) {
      message = stripPlainErrorPrefix(text.trim());
    }
    throw new Error(message);
  }

  if (!text.trim()) return null;
  if (data == null || typeof data !== 'object') {
    throw new Error('Invalid JSON response');
  }
  return data;
}

/** Backend sometimes returns text/plain (e.g. HttpMessageNotReadableException handler). */
function stripPlainErrorPrefix(text) {
  const prefix = 'Cannot parse JSON :: ';
  return text.startsWith(prefix) ? text.slice(prefix.length) : text;
}

function pickAccessToken(data) {
  if (!data || typeof data !== 'object') return '';
  return data.access_token || data.accessToken || '';
}

export async function login({ email, password }) {
  const data = await requestJson('/api/v1/auth/authenticate', {
    method: 'POST',
    body: { email: String(email || '').trim(), password },
  });
  setToken(pickAccessToken(data));
  return data;
}

export async function register({ email, password }) {
  const data = await requestJson('/api/v1/auth/register', {
    method: 'POST',
    body: { email: String(email || '').trim(), password },
  });
  setToken(pickAccessToken(data));
  return data;
}

export async function logout() {
  try {
    await requestJson('/api/v1/auth/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
}

