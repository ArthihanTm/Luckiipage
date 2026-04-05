import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { getDailySpinStatus, postDailySpin } from '../api/dailySpin';
import { Disclaimer } from '../components/Disclaimer';
import { formatChips } from '../utils/chips';

/** Order must match backend DailySpinPrize enum indices. */
const SEGMENTS = [
  { label: 'Bronze', chips: 1000, color: '#4A3528' },
  { label: 'Silver', chips: 2500, color: '#3D4A52' },
  { label: 'Gold', chips: 5000, color: '#5C4A1A' },
  { label: 'Platinum', chips: 12500, color: '#2A3A4A' },
  { label: 'Jackpot', chips: 35000, color: '#4A1A1A' },
  { label: 'Mega', chips: 100000, color: '#1A3A1A' },
];

const N = SEGMENTS.length;
const segmentAngle = 360 / N;
const SPIN_TRANSITION_MS = 4000;

function conicGradient() {
  return SEGMENTS.map((s, i) => {
    const a0 = (i / N) * 360;
    const a1 = ((i + 1) / N) * 360;
    return `${s.color} ${a0}deg ${a1}deg`;
  }).join(', ');
}

function formatCountdown(iso) {
  if (!iso) return '';
  const t = new Date(iso).getTime() - Date.now();
  if (t <= 0) return 'Available now';
  const h = Math.floor(t / 3600000);
  const m = Math.floor((t % 3600000) / 60000);
  const s = Math.floor((t % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

export default function DailySpin() {
  const { setBalance } = useOutletContext();
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState('');
  const [lastWin, setLastWin] = useState(null);
  const [displayedReward, setDisplayedReward] = useState(0);
  const [tick, setTick] = useState(0);
  const pendingResultRef = useRef(null);
  const spinFallbackTimerRef = useRef(null);

  const clearSpinFallback = useCallback(() => {
    if (spinFallbackTimerRef.current) {
      clearTimeout(spinFallbackTimerRef.current);
      spinFallbackTimerRef.current = null;
    }
  }, []);

  const finalizeSpin = useCallback(() => {
    const result = pendingResultRef.current;
    if (!result) return;
    pendingResultRef.current = null;
    clearSpinFallback();
    setLastWin(result);
    setBalance(result.chipBalance);
    setStatus({
      canSpin: false,
      chipBalance: result.chipBalance,
      nextSpinAvailableAt: result.nextSpinAvailableAt,
    });
    setSpinning(false);
  }, [clearSpinFallback, setBalance]);

  const loadStatus = useCallback(async () => {
    setError('');
    try {
      const s = await getDailySpinStatus();
      setStatus(s);
      if (typeof s.chipBalance === 'number') {
        setBalance(s.chipBalance);
      }
    } catch (e) {
      setStatus(null);
      setError(e?.message || 'Could not load daily spin');
    } finally {
      setLoading(false);
    }
  }, [setBalance]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (!status || status.canSpin || !status.nextSpinAvailableAt) return undefined;
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (!lastWin) {
      setDisplayedReward(0);
      return;
    }
    const target = lastWin.rewardChips;
    setDisplayedReward(0);
    const durationMs = 700;
    const t0 = performance.now();
    let frameId;
    function frame(now) {
      const t = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - (1 - t) ** 2;
      setDisplayedReward(Math.round(target * eased));
      if (t < 1) frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [lastWin]);

  useEffect(() => () => clearSpinFallback(), [clearSpinFallback]);

  function onWheelTransitionEnd(e) {
    if (e.propertyName !== 'transform') return;
    if (!pendingResultRef.current) return;
    finalizeSpin();
  }

  async function onSpin() {
    if (!status?.canSpin || spinning) return;
    setError('');
    setLastWin(null);
    pendingResultRef.current = null;
    clearSpinFallback();
    setSpinning(true);
    try {
      const result = await postDailySpin();
      pendingResultRef.current = result;
      const align = 360 - (result.segmentIndex * segmentAngle + segmentAngle / 2);
      const spins = 7;
      setRotation((prev) => {
        const mod = ((prev % 360) + 360) % 360;
        const delta = spins * 360 + ((align - mod + 360) % 360);
        return prev + delta;
      });
      spinFallbackTimerRef.current = setTimeout(() => {
        spinFallbackTimerRef.current = null;
        if (pendingResultRef.current) finalizeSpin();
      }, SPIN_TRANSITION_MS + 250);
    } catch (e) {
      pendingResultRef.current = null;
      clearSpinFallback();
      setSpinning(false);
      setError(e?.message || 'Spin failed');
      await loadStatus();
    }
  }

  const countdown = useMemo(() => {
    if (!status?.nextSpinAvailableAt || status.canSpin) return '';
    return formatCountdown(status.nextSpinAvailableAt);
  }, [status?.nextSpinAvailableAt, status?.canSpin, tick]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 text-[#8A8A7A] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
        Loading…
      </div>
    );
  }

  if (error && !status) {
    const isAuth = /401|Unauthorized|Forbidden|403/i.test(error);
    return (
      <div className="max-w-md mx-auto border border-[#2A3A28] rounded-[4px] p-6 text-center" style={{ background: '#1A2119' }}>
        <h1 className="text-[#E8E0D0] text-lg mb-2" style={{ fontFamily: "'Spectral', serif" }}>
          Daily Spin
        </h1>
        <p className="text-[#8A8A7A] text-sm mb-4">{isAuth ? 'Sign in to claim your free daily chips.' : error}</p>
        <Link
          to={isAuth ? '/login' : '/app'}
          className="inline-block px-4 py-2 text-sm text-[#E8E0D0] rounded-[2px]"
          style={{ background: '#8B1A1A' }}
        >
          {isAuth ? 'Sign In' : 'Back to lobby'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-16 lg:pb-4">
      <div>
        <h1 className="text-[#E8E0D0] text-xl mb-1" style={{ fontFamily: "'Spectral', serif" }}>
          Daily Spin
        </h1>
        <p className="text-[#8A8A7A] text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>
          One free spin every 24 hours. Virtual chips only — entertainment, not real money.
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        <div
          className="absolute -top-1 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent"
          style={{ borderTopColor: '#C8A84B' }}
          aria-hidden
        />
        <div
          className="mt-3 rounded-full border-4 border-[#2A3A28] shadow-lg overflow-hidden"
          role="presentation"
          onTransitionEnd={onWheelTransitionEnd}
          style={{
            width: 'min(100vw - 3rem, 280px)',
            height: 'min(100vw - 3rem, 280px)',
            transition: `transform ${SPIN_TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(from 0deg, ${conicGradient()})`,
          }}
        />
        <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-sm">
          {SEGMENTS.map((s) => (
            <span
              key={s.label}
              className="text-[10px] px-2 py-0.5 rounded-[2px] text-[#8A8A7A]"
              style={{ background: '#141C16', fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {s.label}: {formatChips(s.chips)}
            </span>
          ))}
        </div>
      </div>

      {error && status && <p className="text-sm text-[#F87171] text-center">{error}</p>}

      {lastWin && (
        <div
          className="border border-[#C8A84B]/40 rounded-[4px] p-4 text-center"
          style={{ background: '#1A2119' }}
        >
          <div className="text-[#C8A84B] text-sm mb-1" style={{ fontFamily: "'Spectral', serif" }}>
            {lastWin.segmentLabel}
          </div>
          <div className="text-[#4ADE80] text-lg" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            +{formatChips(displayedReward)} chips
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onSpin}
          disabled={!status?.canSpin || spinning}
          className="px-8 py-2.5 text-sm text-[#E8E0D0] rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#A02020]"
          style={{ background: '#8B1A1A', fontFamily: "'Barlow', sans-serif" }}
        >
          {spinning ? 'Spinning…' : status?.canSpin ? 'Spin' : 'Come back later'}
        </button>
        {!status?.canSpin && status?.nextSpinAvailableAt && (
          <p className="text-[11px] text-[#8A8A7A]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Next spin in {countdown}
          </p>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}
