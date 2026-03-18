import { useState, useCallback } from 'react';
import { Disclaimer } from '../components/Disclaimer';
import { Bomb, Diamond } from 'lucide-react';

const GRID = 5;

function generateMines(mineCount) {
  const mines = new Set();
  while (mines.size < mineCount) {
    mines.add(Math.floor(Math.random() * GRID * GRID));
  }
  return mines;
}

export default function Mines() {
  const [mineCount, setMineCount] = useState(5);
  const [bet, setBet] = useState(100);
  const [grid, setGrid] = useState(Array(25).fill('hidden'));
  const [mines, setMines] = useState(() => generateMines(5));
  const [revealed, setRevealed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);

  const multiplier = revealed === 0 ? 1 : parseFloat((1 + revealed * (mineCount / (25 - mineCount)) * 0.5).toFixed(2));
  const payout = Math.floor(bet * multiplier);

  const reveal = useCallback(
    (idx) => {
      if (grid[idx] !== 'hidden' || gameOver || cashedOut) return;
      const newGrid = [...grid];
      if (mines.has(idx)) {
        newGrid[idx] = 'mine';
        mines.forEach((m) => {
          newGrid[m] = 'mine';
        });
        setGrid(newGrid);
        setGameOver(true);
      } else {
        newGrid[idx] = 'gem';
        setGrid(newGrid);
        setRevealed((r) => r + 1);
      }
    },
    [grid, mines, gameOver, cashedOut],
  );

  const cashOut = () => {
    if (revealed > 0 && !gameOver) setCashedOut(true);
  };

  const reset = () => {
    const newMines = generateMines(mineCount);
    setMines(newMines);
    setGrid(Array(25).fill('hidden'));
    setRevealed(0);
    setGameOver(false);
    setCashedOut(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row" style={{ background: '#0E1310' }}>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-5 gap-2 w-full max-w-[360px]">
          {grid.map((cell, i) => (
            <button
              key={i}
              onClick={() => reveal(i)}
              disabled={cell !== 'hidden' || gameOver || cashedOut}
              className="aspect-square rounded-[4px] border border-[#2A3A28] flex items-center justify-center transition-all hover:border-[#3A4A38] disabled:cursor-default"
              style={{ background: cell === 'gem' ? '#1a3a1a' : cell === 'mine' ? '#3A1A1A' : '#1A2119' }}
            >
              {cell === 'gem' && <Diamond size={20} className="text-[#4ADE80]" />}
              {cell === 'mine' && <Bomb size={20} className="text-[#F87171]" />}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[#2A3A28] p-4 flex flex-col gap-4" style={{ background: '#141C16' }}>
        <div>
          <label className="text-[#8A8A7A] text-[11px] uppercase tracking-wider block mb-1.5">Mines</label>
          <div className="flex gap-1">
            {[1, 3, 5, 10, 15].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setMineCount(n);
                  reset();
                }}
                className={`flex-1 py-1.5 text-xs rounded-[2px] border ${
                  mineCount === n ? 'border-[#C8A84B] text-[#C8A84B]' : 'border-[#2A3A28] text-[#8A8A7A]'
                }`}
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
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-[2px] border border-[#2A3A28] text-[#E8E0D0] text-sm focus:border-[#C8A84B] focus:ring-1 focus:ring-[#C8A84B] outline-none"
            style={{ background: '#0E1310', fontFamily: "'IBM Plex Mono', monospace" }}
          />
        </div>

        <div className="text-center py-4">
          <div className="text-[#8A8A7A] text-[10px] uppercase tracking-wider mb-1">Multiplier</div>
          <div className="text-[#C8A84B] text-4xl" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
            {multiplier}x
          </div>
          <div className="text-[#8A8A7A] text-xs mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Payout: {payout.toLocaleString()}
          </div>
        </div>

        {!gameOver && !cashedOut && (
          <button
            onClick={cashOut}
            disabled={revealed === 0}
            className="w-full py-3 text-sm uppercase tracking-wider rounded-[2px] text-[#E8E0D0] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#A02020]"
            style={{ background: '#8B1A1A' }}
          >
            Cash Out {payout.toLocaleString()}
          </button>
        )}

        {(gameOver || cashedOut) && (
          <div className="space-y-2">
            {cashedOut && (
              <div className="text-center py-2 rounded-[2px] border border-[#4ADE80]/20" style={{ background: '#1a3a1a' }}>
                <span className="text-[#4ADE80] text-sm" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  +{payout.toLocaleString()} chips
                </span>
              </div>
            )}
            {gameOver && (
              <div className="text-center py-2 rounded-[2px] border border-[#F87171]/20" style={{ background: '#3A1A1A' }}>
                <span className="text-[#F87171] text-sm">Boom! You hit a mine.</span>
              </div>
            )}
            <button
              onClick={reset}
              className="w-full py-3 text-sm uppercase tracking-wider rounded-[2px] text-[#E8E0D0] hover:bg-[#A02020]"
              style={{ background: '#8B1A1A' }}
            >
              Play Again
            </button>
          </div>
        )}

        <div className="mt-auto">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
