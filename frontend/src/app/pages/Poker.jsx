import { useState } from 'react';
import { PlayingCard } from '../components/PlayingCard';
import { Disclaimer } from '../components/Disclaimer';

const communityCards = [
  { rank: 'A', suit: 'hearts' },
  { rank: '7', suit: 'clubs' },
  { rank: 'J', suit: 'diamonds' },
  null,
  null,
];

const players = [
  { name: 'You', chips: 12400, cards: [{ rank: 'K', suit: 'spades' }, { rank: 'Q', suit: 'hearts' }], position: 'bottom', active: true },
  { name: 'DarkKnight', chips: 8700, cards: null, position: 'left-bottom', active: true },
  { name: 'AceHigh_22', chips: 15200, cards: null, position: 'left-top', active: true },
  { name: 'SharkFin', chips: 6300, cards: null, position: 'top', active: false },
  { name: 'QueenBee', chips: 11800, cards: null, position: 'right-top', active: true },
  { name: 'LuckyDraw', chips: 9100, cards: null, position: 'right-bottom', active: true },
];

const pot = 3200;

const seatPositions = {
  bottom: 'bottom-20 left-1/2 -translate-x-1/2',
  'left-bottom': 'bottom-1/3 left-4 lg:left-12',
  'left-top': 'top-1/4 left-4 lg:left-12',
  top: 'top-12 left-1/2 -translate-x-1/2',
  'right-top': 'top-1/4 right-4 lg:right-12',
  'right-bottom': 'bottom-1/3 right-4 lg:right-12',
};

export default function Poker() {
  const [action, setAction] = useState('');

  return (
    <div className="h-full flex flex-col" style={{ background: '#0E1310' }}>
      <div className="flex-1 relative flex items-center justify-center p-4 min-h-[500px]">
        <div
          className="absolute w-[85%] max-w-[700px] h-[60%] max-h-[360px] rounded-[50%] border-2 border-[#C8A84B]/15"
          style={{ background: 'radial-gradient(ellipse at 50% 45%, #245024 0%, #1a3a1a 50%, #0E1310 90%)' }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <div className="text-[10px] text-[#8A8A7A] uppercase tracking-wider">Pot</div>
          <div className="text-[#C8A84B] text-xl" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
            {pot.toLocaleString()}
          </div>
        </div>

        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {communityCards.map((c, i) =>
            c ? (
              <PlayingCard key={i} rank={c.rank} suit={c.suit} size="sm" />
            ) : (
              <div
                key={i}
                className="rounded-[3px] border border-[#2A3A28] border-dashed"
                style={{ width: 48, height: 68, background: 'rgba(26,33,25,0.5)' }}
              />
            ),
          )}
        </div>

        {players.map((p) => (
          <div key={p.name} className={`absolute z-10 ${seatPositions[p.position]}`}>
            <div className={`flex flex-col items-center gap-1 ${!p.active ? 'opacity-40' : ''}`}>
              {p.cards ? (
                <div className="flex gap-0.5 mb-1">
                  {p.cards.map((c, i) => (
                    <PlayingCard key={i} rank={c.rank} suit={c.suit} size="sm" />
                  ))}
                </div>
              ) : (
                <div className="flex gap-0.5 mb-1">
                  <PlayingCard rank="" suit="spades" faceDown size="sm" />
                  <PlayingCard rank="" suit="spades" faceDown size="sm" />
                </div>
              )}
              <div className="px-3 py-1 rounded-[2px] border border-[#2A3A28] text-center" style={{ background: '#1A2119' }}>
                <div className="text-[#E8E0D0] text-[11px]">{p.name}</div>
                <div className="text-[10px] text-[#C8A84B]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {p.chips.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#2A3A28] px-4 py-3" style={{ background: '#141C16' }}>
        <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
          <button
            onClick={() => setAction('fold')}
            className="px-5 py-2 text-xs uppercase tracking-wider text-[#8A8A7A] rounded-[2px] border border-[#2A3A28] hover:text-[#E8E0D0] hover:bg-[#1A2119]"
            style={{ background: '#0E1310' }}
          >
            Fold
          </button>
          <button
            onClick={() => setAction('check')}
            className="px-5 py-2 text-xs uppercase tracking-wider text-[#E8E0D0] rounded-[2px] border border-[#2A3A28] hover:bg-[#1A2119]"
            style={{ background: '#0E1310' }}
          >
            Check
          </button>
          <button
            onClick={() => setAction('call')}
            className="px-5 py-2 text-xs uppercase tracking-wider text-[#E8E0D0] rounded-[2px] hover:bg-[#A02020]"
            style={{ background: '#8B1A1A' }}
          >
            Call 400
          </button>
          <button onClick={() => setAction('raise')} className="px-5 py-2 text-xs uppercase tracking-wider text-[#C8A84B] rounded-[2px] border border-[#C8A84B]/30 hover:bg-[#C8A84B]/10">
            Raise
          </button>
          <button
            onClick={() => setAction('allin')}
            className="px-5 py-2 text-xs uppercase tracking-wider text-[#E8E0D0] rounded-[2px]"
            style={{ background: 'linear-gradient(135deg, #8B1A1A, #C8A84B)' }}
          >
            All In
          </button>
        </div>
        {action ? (
          <div className="text-center mt-2 text-[10px] text-[#8A8A7A] uppercase tracking-widest">
            Selected Action: <span className="text-[#C8A84B]">{action}</span>
          </div>
        ) : null}
      </div>

      <Disclaimer />
    </div>
  );
}
