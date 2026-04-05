import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Disclaimer } from '../components/Disclaimer';
import { TrendingUp, TrendingDown, Clock, Flame, ChevronRight } from 'lucide-react';

const recentSessions = [
  { game: 'Blackjack', result: '+2,400', win: true, time: '12 min ago', hands: 18 },
  { game: 'Mines', result: '-800', win: false, time: '1 hr ago', hands: 5 },
  { game: 'Poker', result: '+5,200', win: true, time: '3 hr ago', hands: 42 },
  { game: 'Blackjack', result: '-1,100', win: false, time: '5 hr ago', hands: 24 },
  { game: 'Mines', result: '+3,800', win: true, time: '8 hr ago', hands: 12 },
];

const liveFeed = [
  { player: 'AceHigh_22', action: 'won 8,200 chips at Blackjack', time: 'just now' },
  { player: 'DarkKnight', action: 'hit 12x multiplier in Mines', time: '30s ago' },
  { player: 'QueenBee', action: 'won tournament #341', time: '2m ago' },
  { player: 'SharkFin', action: 'won 2,500 chips on Daily Spin', time: '5m ago' },
  { player: 'LuckyDraw', action: 'cashed out 15,400 in Mines', time: '8m ago' },
];

const statsRow = [
  { label: 'Total Wagered', value: '142,800', change: '+12%' },
  { label: 'Net Profit', value: '+18,200', change: '+8%' },
  { label: 'Win Rate', value: '52.3%', change: '+2.1%' },
  { label: 'Sessions Today', value: '7', change: '' },
];

export default function Dashboard() {
  return (
    <div className="space-y-4 pb-16 lg:pb-4">
      <Link
        to="/app/blackjack"
        className="block relative overflow-hidden rounded-[4px] border border-[#2A3A28]"
        style={{ background: 'linear-gradient(135deg, #1a3a1a 0%, #0E1310 60%, #3A1A1A 100%)' }}
      >
        <div className="flex items-center justify-between p-5 lg:p-8">
          <div>
            <Badge variant="hot">Hot</Badge>
            <h2 className="text-[#E8E0D0] text-xl lg:text-2xl mt-2 mb-1" style={{ fontFamily: "'Spectral', serif" }}>
              Blackjack Classic
            </h2>
            <p className="text-[#8A8A7A] text-xs mb-3">6-deck shoe - 3:2 payout - Insurance available</p>
            <div className="inline-flex items-center gap-2 text-sm text-[#E8E0D0] px-4 py-1.5 rounded-[2px]" style={{ background: '#8B1A1A' }}>
              Play Now <ChevronRight size={14} />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-6xl text-[#2A3A28]/50" style={{ fontFamily: "'Spectral', serif" }}>
            ♠ ♥ ♣ ♦
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsRow.map((s) => (
          <div key={s.label} className="border border-[#2A3A28] rounded-[4px] p-3" style={{ background: '#1A2119' }}>
            <div className="text-[#8A8A7A] text-[11px] mb-1">{s.label}</div>
            <div className="text-[#E8E0D0] text-lg" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>
              {s.value}
            </div>
            {s.change && <div className="text-[10px] text-[#4ADE80] mt-0.5">{s.change}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 border border-[#2A3A28] rounded-[4px]" style={{ background: '#1A2119' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3A28]">
            <h3 className="text-[#E8E0D0] text-sm" style={{ fontFamily: "'Spectral', serif" }}>
              Recent Sessions
            </h3>
            <Clock size={14} className="text-[#8A8A7A]" />
          </div>
          <div className="divide-y divide-[#2A3A28]">
            {recentSessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[2px] flex items-center justify-center" style={{ background: '#0E1310' }}>
                    {s.win ? <TrendingUp size={14} className="text-[#4ADE80]" /> : <TrendingDown size={14} className="text-[#F87171]" />}
                  </div>
                  <div>
                    <div className="text-[#E8E0D0] text-xs">{s.game}</div>
                    <div className="text-[#8A8A7A] text-[10px]">
                      {s.hands} hands - {s.time}
                    </div>
                  </div>
                </div>
                <span className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: s.win ? '#4ADE80' : '#F87171' }}>
                  {s.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#2A3A28] rounded-[4px]" style={{ background: '#1A2119' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3A28]">
            <div className="flex items-center gap-2">
              <h3 className="text-[#E8E0D0] text-sm" style={{ fontFamily: "'Spectral', serif" }}>
                Live Feed
              </h3>
              <Badge variant="live">Live</Badge>
            </div>
            <Flame size={14} className="text-[#C8A84B]" />
          </div>
          <div className="divide-y divide-[#2A3A28]">
            {liveFeed.map((f, i) => (
              <div key={i} className="px-4 py-2.5">
                <div className="text-xs">
                  <span className="text-[#C8A84B]">{f.player}</span> <span className="text-[#8A8A7A]">{f.action}</span>
                </div>
                <div className="text-[10px] text-[#555] mt-0.5">{f.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
