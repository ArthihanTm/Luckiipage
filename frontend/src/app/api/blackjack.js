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
    const message =
      data?.message ||
      (data && typeof data === 'object' ? Object.values(data).join('\n') : null) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export async function startBlackjack({ bet }) {
  return requestJson('/api/v1/blackjack/start', {
    method: 'POST',
    body: { bet },
  });
}

export async function getBlackjack(gameId) {
  return requestJson(`/api/v1/blackjack/${encodeURIComponent(gameId)}`);
}

export async function hitBlackjack(gameId) {
  return requestJson(`/api/v1/blackjack/${encodeURIComponent(gameId)}/hit`, {
    method: 'POST',
  });
}

export async function standBlackjack(gameId) {
  return requestJson(`/api/v1/blackjack/${encodeURIComponent(gameId)}/stand`, {
    method: 'POST',
  });
}

