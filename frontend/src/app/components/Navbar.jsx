import { Bell, Plus, Search } from 'lucide-react';
import { formatChips } from '../utils/chips';

export function Navbar({ balance, onPlaytimeRewardsClick }) {
  return (
    <div
      className="h-12 flex items-center justify-between px-4 border-b border-[#2A3A28] shrink-0"
      style={{ background: '#141C16' }}
    >
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <span className="text-[#E8E0D0]" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
            LuckiiPage
          </span>
        </div>
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-[2px] border border-[#2A3A28]"
          style={{ background: '#0E1310' }}
        >
          <Search size={14} className="text-[#8A8A7A]" />
          <input
            className="bg-transparent text-sm text-[#E8E0D0] placeholder-[#8A8A7A] outline-none w-48"
            placeholder="Search games..."
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative text-[#8A8A7A] hover:text-[#E8E0D0]">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#8B1A1A]" />
        </button>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-[2px] border border-[#2A3A28]"
          style={{ background: '#0E1310' }}
        >
          <span className="text-[#C8A84B] text-xs">◆</span>
          <span className="text-[#E8E0D0] text-sm" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {formatChips(balance ?? 0)}
          </span>
          <button
            type="button"
            onClick={onPlaytimeRewardsClick}
            className="ml-1 flex items-center justify-center w-5 h-5 rounded-[2px] hover:opacity-90"
            style={{ background: '#8B1A1A' }}
            title="Earn chips from online time"
            aria-label="Open playtime rewards"
          >
            <Plus size={12} className="text-[#E8E0D0]" />
          </button>
        </div>
      </div>
    </div>
  );
}
