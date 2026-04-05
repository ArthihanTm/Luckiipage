import { useCallback, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Disclaimer } from '../components/Disclaimer';
import { cashOutMines, revealMines, startMines } from '../api/mines';
import { formatChips } from '../utils/chips';
import { Bomb, Diamond } from 'lucide-react';

const ROWS = 5;
const COLS = 5;
const TOTAL = ROWS * COLS;

const MINE_PRESETS = [1, 3, 5, 10, 15];

function indexToCoords(index) {
  return { row: Math.floor(index / COLS), col: index % COLS };
}

function cellState(index, revealedSafeIndices, mineIndices) {
  const revealed = new Set(revealedSafeIndices || []);
  if (revealed.has(index)) return 'gem';
  if (mineIndices != null && mineIndices.includes(index)) return 'mine';
  return 'hidden';
}

export default function Mines() {
  const { balance, setBalance } = useOutletContext();
  const [mineCount, setMineCount] = useState(5);
  const [betInput, setBetInput] = useState(100);
  const [gameId, setGameId] = useState(null);
  const [status, setStatus] = useState(null);
  const [lockedBet, setLockedBet] = useState(0);
  const [revealedSafeIndices, setRevealedSafeIndices] = useState([]);
  const [mineIndices, setMineIndices] = useState(null);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [lastPayout, setLastPayout] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const balanceFloor = Math.max(0, Math.floor(Number(balance) || 0));
  const betFloor = Math.max(0, Math.floor(Number(betInput) || 0));
  const effectiveBet = Math.min(betFloor, balanceFloor);

  const playing = status === 'PLAYING';
  const finished = status === 'LOST' || status === 'WON_CASHOUT';

  const payoutPreview = useMemo(
    () => Math.floor(lockedBet * (currentMultiplier || 1)),
    [lockedBet, currentMultiplier],
  );

  const syncFromServer = useCallback((payload) => {
    setStatus(payload.status);
    setRevealedSafeIndices([...(payload.revealedSafeIndices || [])].sort((a, b) => a - b));
    if (payload.currentMultiplier != null) setCurrentMultiplier(payload.currentMultiplier);
    const mines = payload.mineIndices ?? payload.mineIndicesIfFinished;
    setMineIndices(mines != null ? [...mines].sort((a, b) => a - b) : null);
  }, []);

  const startGame = async () => {
    setError('');
    if (effectiveBet < 1) {
      setError('Set a bet of at least 1 chip.');
      return;
    }
    if (mineCount >= TOTAL) {
      setError('Mine count must be less than grid cells.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await startMines({
        bet: effectiveBet,
        mineCount,
        rows: ROWS,
        cols: COLS,
      });
      setBalance((b) => b - effectiveBet);
      setGameId(res.gameId);
      setLockedBet(res.bet);
      setLastPayout(0);
      syncFromServer(res);
    } catch (e) {
      setError(e?.message || 'Failed to start game');
    } finally {
      setSubmitting(false);
    }
  };

  const reveal = useCallback(
    async (index) => {
      if (!gameId || !playing || submitting) return;
      const { row, col } = indexToCoords(index);
      if (revealedSafeIndices.includes(index)) return;

      setError('');
      setSubmitting(true);
      try {
        const res = await revealMines(gameId, { row, col });
        syncFromServer(res);
        if (res.status === 'WON_CASHOUT' && res.payout > 0) {
          setBalance((b) => b + res.payout);
          setLastPayout(res.payout);
        }
        if (res.status === 'LOST') {
          setLastPayout(0);
        }
      } catch (e) {
        setError(e?.message || 'Reveal failed');
      } finally {
        setSubmitting(false);
      }
    },
    [gameId, playing, submitting, revealedSafeIndices, syncFromServer, setBalance],
  );

  const cashOut = async () => {
    if (!gameId || !playing || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await cashOutMines(gameId);
      syncFromServer(res);
      setBalance((b) => b + res.payout);
      setLastPayout(res.payout);
      if (lockedBet > 0 && res.payout > 0) {
        setCurrentMultiplier(res.payout / lockedBet);
      }
    } catch (e) {
      setError(e?.message || 'Cash out failed');
    } finally {
      setSubmitting(false);
    }
  };

  const playAgain = () => {
    setGameId(null);
    setStatus(null);
    setLockedBet(0);
    setRevealedSafeIndices([]);
    setMineIndices(null);
    setCurrentMultiplier(1);
    setLastPayout(0);
    setError('');
  };

  return (
    <div className="h-full flex flex-col lg:flex-row" style={{ background: '#0E1310' }}>
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="grid gap-2 w-full max-w-[360px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: TOTAL }, (_, i) => {
            const cell = cellState(i, revealedSafeIndices, mineIndices);
            const disabled =
              submitting ||
              !playing ||
              cell !== 'hidden' ||
              !gameId;
            return (
              <button
                key={i}
                type="button"
                onClick={() => reveal(i)}
                disabled={disabled}
                className="aspect-square rounded-[4px] border border-[#2A3A28] flex items-center justify-center transition-all hover:border-[#3A4A38] disabled:cursor-default"
                style={{
                  background: cell === 'gem' ? '#1a3a1a' : cell === 'mine' ? '#3A1A1A' : '#1A2119',
                }}
              >
                {cell === 'gem' && <Diamond size={20} className="text-[#4ADE80]" />}
                {cell === 'mine' && <Bomb size={20} className="text-[#F87171]" />}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[#2A3A28] p-4 flex flex-col gap-4"
        style={{ background: '#141C16' }}
      >
        <div>
          <label className="text-[#8A8A7A] text-[11px] uppercase tracking-wider block mb-1.5">Mines</label>
          <div className="flex gap-1 flex-wrap">
            {MINE_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                disabled={!!gameId}
                onClick={() => setMineCount(n)}
                className={`flex-1 min-w-[2.5rem] py-1.5 text-xs rounded-[2px] border ${
                  mineCount === n ? 'border-[#C8A84B] text-[#C8A84B]' : 'border-[#2A3A28] text-[#8A8A7A]'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                style={{ background: mineCount === n ? 'rgba(200,168,75,0.08)' : '#0E1310' }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[#8A8A7A] text-[11px] uppercase tracking-wider block mb-1.5">Bet Amount</label>
          <input
            type="number"
            value={betInput}
            disabled={!!gameId}
            onChange={(e) => setBetInput(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-[2px] border border-[#2A3A28] text-[#E8E0D0] text-sm focus:border-[#C8A84B] focus:ring-1 focus:ring-[#C8A84B] outline-none disabled:opacity-40"
            style={{ background: '#0E1310', fontFamily: "'IBM Plex Mono', monospace" }}
          />
          {!gameId && (
            <p className="text-[10px] text-[#5A5A4A] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Effective stake: {formatChips(effectiveBet)} (capped by balance)
            </p>
          )}
        </div>

        {!gameId && (
          <button
            type="button"
            onClick={startGame}
            disabled={submitting || effectiveBet < 1}
            className="w-full py-3 text-sm uppercase tracking-wider rounded-[2px] text-[#E8E0D0] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#A02020]"
            style={{ background: '#8B1A1A' }}
          >
            {submitting ? 'Starting…' : 'Start game'}
          </button>
        )}

        {gameId && (
          <div className="text-center py-4">
            <div className="text-[#8A8A7A] text-[10px] uppercase tracking-wider mb-1">Multiplier</div>
            <div className="text-[#C8A84B] text-4xl" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
              {Number(currentMultiplier).toFixed(2)}x
            </div>
            <div className="text-[#8A8A7A] text-xs mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Payout: {formatChips(payoutPreview)}
            </div>
          </div>
        )}

        {playing && (
          <button
            type="button"
            onClick={cashOut}
            disabled={submitting || revealedSafeIndices.length < 1}
            className="w-full py-3 text-sm uppercase tracking-wider rounded-[2px] text-[#E8E0D0] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#A02020]"
            style={{ background: '#8B1A1A' }}
          >
            Cash out {formatChips(payoutPreview)}
          </button>
        )}

        {finished && (
          <div className="space-y-2">
            {status === 'WON_CASHOUT' && lastPayout > 0 && (
              <div className="text-center py-2 rounded-[2px] border border-[#4ADE80]/20" style={{ background: '#1a3a1a' }}>
                <span className="text-[#4ADE80] text-sm" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  +{formatChips(lastPayout)} chips
                </span>
              </div>
            )}
            {status === 'LOST' && (
              <div className="text-center py-2 rounded-[2px] border border-[#F87171]/20" style={{ background: '#3A1A1A' }}>
                <span className="text-[#F87171] text-sm">Boom! You hit a mine.</span>
              </div>
            )}
            <button
              type="button"
              onClick={playAgain}
              className="w-full py-3 text-sm uppercase tracking-wider rounded-[2px] text-[#E8E0D0] hover:bg-[#A02020]"
              style={{ background: '#8B1A1A' }}
            >
              Play again
            </button>
          </div>
        )}

        {error ? (
          <div className="text-xs text-[#F87171] border border-[#3A1A1A] rounded-[2px] px-3 py-2" style={{ background: '#1A2119' }}>
            {error}
          </div>
        ) : null}

        <div className="mt-auto">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
