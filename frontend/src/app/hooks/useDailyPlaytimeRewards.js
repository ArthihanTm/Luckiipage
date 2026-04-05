import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'luckii_playtime_daily_v2';

function localDayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const day = localDayKey();
      return { day, seconds: 0, claimed: [] };
    }
    const o = JSON.parse(raw);
    const day = localDayKey();
    if (o.day !== day) {
      return { day, seconds: 0, claimed: [] };
    }
    return {
      day: o.day,
      seconds: Math.max(0, Math.floor(Number(o.seconds) || 0)),
      claimed: Array.isArray(o.claimed) ? o.claimed.filter((id) => typeof id === 'string') : [],
    };
  } catch {
    const day = localDayKey();
    return { day, seconds: 0, claimed: [] };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/**
 * Accrues visible-tab time for the current local calendar day only.
 * Resets at local midnight. Each reward tier is claimable at most once per day.
 */
export function useDailyPlaytimeRewards() {
  const [state, setState] = useState(loadState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      setState((prev) => {
        const day = localDayKey();
        if (prev.day !== day) {
          const next = { day, seconds: 1, claimed: [] };
          saveState(next);
          return next;
        }
        const next = { ...prev, seconds: prev.seconds + 1 };
        if (next.seconds % 15 === 0) saveState(next);
        return next;
      });
    };

    const id = setInterval(tick, 1000);
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      setState((prev) => {
        const day = localDayKey();
        if (prev.day !== day) {
          const next = { day, seconds: 0, claimed: [] };
          saveState(next);
          return next;
        }
        saveState(prev);
        return prev;
      });
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
      saveState(stateRef.current);
    };
  }, []);

  const tryClaim = useCallback((tier) => {
    let ok = false;
    setState((prev) => {
      const day = localDayKey();
      if (prev.day !== day) return prev;
      if (prev.seconds < tier.seconds) return prev;
      if (prev.claimed.includes(tier.id)) return prev;
      ok = true;
      const next = { ...prev, claimed: [...prev.claimed, tier.id] };
      saveState(next);
      return next;
    });
    return ok;
  }, []);

  const day = localDayKey();
  const aligned = state.day === day ? state : { day, seconds: 0, claimed: [] };

  return {
    todaySeconds: aligned.seconds,
    claimedTierIds: aligned.claimed,
    tryClaim,
  };
}
