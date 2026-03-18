import { useState } from 'react';
import { PlayingCard } from '../components/PlayingCard';
import { CasinoChip } from '../components/CasinoChip';
import { Disclaimer } from '../components/Disclaimer';

const initialDealer = [{ rank: 'K', suit: 'spades' }];
const initialPlayer = [
  { rank: '10', suit: 'hearts' },
  { rank: 'A', suit: 'spades' },
];

const chipValues = [1, 5, 25, 100, 500];

export default function Blackjack() {
  const [dealerCards, setDealerCards] = useState([...initialDealer, { rank: '', suit: 'spades', faceDown: true }]);
  const [playerCards, setPlayerCards] = useState(initialPlayer);
  const [selectedChip, setSelectedChip] = useState(25);
  const [bet] = useState(100);
  const [gameState, setGameState] = useState('playing');
  const [message, setMessage] = useState('');

  const dealerTotal = '?';
  const playerTotal = 21;

  const hit = () => {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const newCard = { rank: ranks[Math.floor(Math.random() * ranks.length)], suit: suits[Math.floor(Math.random() * suits.length)] };
    setPlayerCards([...playerCards, newCard]);
  };

  const stand = () => {
    setDealerCards([initialDealer[0], { rank: '7', suit: 'diamonds' }]);
    setMessage('Dealer has 17. You win!');
    setGameState('result');
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: '#0E1310' }}>
      <div
        className="flex-1 relative flex flex-col items-center justify-between py-6 px-4"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #245024 0%, #1a3a1a 40%, #0E1310 80%)' }}
      >
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '80%',
            maxWidth: 700,
            height: 300,
            border: '1px solid rgba(200,168,75,0.15)',
            borderRadius: '0 0 50% 50%',
            borderTop: 'none',
          }}
        />

        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="text-[#8A8A7A] text-[11px] uppercase tracking-widest" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Dealer - {dealerTotal}
          </div>
          <div className="flex gap-2">
            {dealerCards.map((c, i) => (
              <PlayingCard key={i} rank={c.rank} suit={c.suit} faceDown={c.faceDown} size="lg" />
            ))}
          </div>
        </div>

        {message && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="px-6 py-3 rounded-[4px] border border-[#C8A84B]/30" style={{ background: 'rgba(14,19,16,0.9)' }}>
              <span className="text-[#C8A84B] text-lg" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
                {message}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="flex gap-2">
            {playerCards.map((c, i) => (
              <PlayingCard key={i} rank={c.rank} suit={c.suit} size="lg" />
            ))}
          </div>
          <div className="text-[#E8E0D0] text-xs uppercase tracking-widest">
            Your Hand - <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#C8A84B' }}>{playerTotal}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2A3A28] px-4 py-3" style={{ background: '#141C16' }}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            {chipValues.map((v) => (
              <CasinoChip key={v} value={v} selected={selectedChip === v} onClick={() => setSelectedChip(v)} size={40} />
            ))}
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#8A8A7A] uppercase tracking-wider">Current Bet</div>
            <div className="text-[#C8A84B] text-lg" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
              {bet.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={hit}
              disabled={gameState === 'result'}
              className="px-5 py-2 text-xs uppercase tracking-wider text-[#E8E0D0] rounded-[2px] hover:bg-[#A02020] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#8B1A1A' }}
            >
              Hit
            </button>
            <button
              onClick={stand}
              disabled={gameState === 'result'}
              className="px-5 py-2 text-xs uppercase tracking-wider text-[#E8E0D0] rounded-[2px] border border-[#2A3A28] hover:bg-[#1A2119] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#0E1310' }}
            >
              Stand
            </button>
            <button
              disabled={gameState === 'result'}
              className="px-5 py-2 text-xs uppercase tracking-wider text-[#C8A84B] rounded-[2px] border border-[#C8A84B]/30 hover:bg-[#C8A84B]/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Double
            </button>
            <button
              disabled
              className="px-5 py-2 text-xs uppercase tracking-wider text-[#8A8A7A] rounded-[2px] border border-[#2A3A28] opacity-40 cursor-not-allowed"
              style={{ background: '#0E1310' }}
            >
              Split
            </button>
          </div>
        </div>

        {gameState === 'result' && (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => {
                setDealerCards([...initialDealer, { rank: '', suit: 'spades', faceDown: true }]);
                setPlayerCards(initialPlayer);
                setMessage('');
                setGameState('playing');
              }}
              className="px-6 py-2 text-xs uppercase tracking-wider text-[#E8E0D0] rounded-[2px]"
              style={{ background: '#8B1A1A' }}
            >
              Deal Again
            </button>
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}
