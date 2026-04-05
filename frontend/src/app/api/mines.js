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

export async function startMines({ bet, mineCount, rows, cols }) {
  return requestJson('/api/v1/mines/start', {
    method: 'POST',
    body: { bet, mineCount, rows, cols },
  });
}

export async function getMinesState(gameId) {
  return requestJson(`/api/v1/mines/${encodeURIComponent(gameId)}`);
}

export async function revealMines(gameId, { row, col }) {
  return requestJson(`/api/v1/mines/${encodeURIComponent(gameId)}/reveal`, {
    method: 'POST',
    body: { row, col },
  });
}

export async function cashOutMines(gameId) {
  return requestJson(`/api/v1/mines/${encodeURIComponent(gameId)}/cash-out`, {
    method: 'POST',
  });
}
