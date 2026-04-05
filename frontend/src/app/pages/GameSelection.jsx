import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Disclaimer } from '../components/Disclaimer';
import { Users } from 'lucide-react';

const filters = ['All', 'Card Games', 'Instant Win'];

const games = [
  { name: 'Blackjack', cat: 'Card Games', players: 2341, badge: 'hot', path: '/app/blackjack', desc: 'Classic 6-deck, 3:2 payout' },
  { name: 'Mines', cat: 'Instant Win', players: 987, badge: 'hot', path: '/app/mines', desc: '5x5 grid, choose your risk' },
  { name: 'Daily Spin', cat: 'Instant Win', players: 1124, badge: 'new', path: '/app/daily-spin', desc: 'Free wheel every 24 hours' },
];

export default function GameSelection() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? games : games.filter((g) => g.cat === active);

  return (
    <div className="pb-16 lg:pb-4">
      <h2 className="text-[#E8E0D0] text-xl mb-4" style={{ fontFamily: "'Spectral', serif" }}>
        Game Selection
      </h2>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap rounded-[2px] border transition-colors ${
              active === f
                ? 'border-[#C8A84B] text-[#C8A84B]'
                : 'border-[#2A3A28] text-[#8A8A7A] hover:text-[#E8E0D0] hover:border-[#3A4A38]'
            }`}
            style={{ background: active === f ? 'rgba(200,168,75,0.08)' : '#1A2119' }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((g) => (
          <Link
            key={g.name}
            to={g.path}
            className="group border border-[#2A3A28] rounded-[4px] overflow-hidden hover:border-[#C8A84B]/30 transition-colors relative"
            style={{ background: '#1A2119' }}
          >
            <div className="h-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a3a1a 0%, #0E1310 100%)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl text-[#2A3A28]/40" style={{ fontFamily: "'Spectral', serif" }}>
                  {g.name[0]}
                </span>
              </div>
              {g.badge && (
                <div className="absolute top-2 left-2">
                  <Badge variant={g.badge}>{g.badge}</Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-1.5 text-xs text-[#E8E0D0] rounded-[2px]" style={{ background: '#8B1A1A' }}>
                  Play Now
                </span>
              </div>
            </div>
            <div className="p-3">
              <div className="text-[#E8E0D0] text-sm mb-0.5" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
                {g.name}
              </div>
              <div className="text-[#8A8A7A] text-[11px] mb-2">{g.desc}</div>
              <div className="flex items-center gap-1 text-[10px] text-[#4ADE80]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <Users size={10} /> {g.players.toLocaleString()} playing
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}
