import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, Diamond, Bomb, Spade, Gift, Settings, LogOut } from 'lucide-react';
import { formatChips } from '../utils/chips';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
  { icon: Gift, label: 'Daily Spin', path: '/app/daily-spin' },
  { icon: Gamepad2, label: 'All Games', path: '/app/games' },
  { icon: Diamond, label: 'Blackjack', path: '/app/blackjack' },
  { icon: Bomb, label: 'Mines', path: '/app/mines' },
  { icon: Spade, label: 'Poker', path: '/app/poker' },
];

export function Sidebar({ balance }) {
  const location = useLocation();

  return (
    <div className="w-56 h-screen flex flex-col border-r border-[#2A3A28]" style={{ background: '#141C16' }}>
      <div className="px-4 py-4 border-b border-[#2A3A28]">
        <Link to="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[2px] flex items-center justify-center" style={{ background: '#8B1A1A' }}>
            <Diamond size={16} className="text-[#C8A84B]" />
          </div>
          <span className="text-[#E8E0D0] text-lg" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
            LuckiiPage
          </span>
        </Link>
      </div>

      <div className="px-4 py-3 border-b border-[#2A3A28]">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-[2px] flex items-center justify-center text-xs"
            style={{ background: '#243022', color: '#C8A84B', fontFamily: "'IBM Plex Mono', monospace" }}
          >
            LP
          </div>
          <div>
            <div className="text-[#E8E0D0] text-sm">Player</div>
            <div className="text-[10px] text-[#C8A84B] flex items-center gap-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <Gift size={10} /> {formatChips(balance ?? 0)} chips
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-2 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-[2px] text-sm transition-colors ${
                active ? 'text-[#E8E0D0]' : 'text-[#8A8A7A] hover:text-[#E8E0D0] hover:bg-[#1A2119]'
              }`}
              style={active ? { background: '#8B1A1A' } : {}}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-2 border-t border-[#2A3A28] space-y-0.5">
        <button className="flex items-center gap-2.5 px-3 py-2 rounded-[2px] text-sm text-[#8A8A7A] hover:text-[#E8E0D0] hover:bg-[#1A2119] w-full">
          <Settings size={16} /> Settings
        </button>
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-[2px] text-sm text-[#8A8A7A] hover:text-[#E8E0D0] hover:bg-[#1A2119] w-full"
        >
          <LogOut size={16} /> Sign Out
        </Link>
      </div>
    </div>
  );
}
