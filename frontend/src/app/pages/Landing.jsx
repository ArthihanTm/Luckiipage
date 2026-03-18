import { Link } from 'react-router-dom';
import { Diamond, Users, Trophy, Zap, Shield, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const stats = [
  { label: 'Active Players', value: '12,847', icon: Users },
  { label: 'Games Played', value: '1.2M+', icon: Zap },
  { label: 'Tournaments', value: '342', icon: Trophy },
  { label: 'Win Rate Avg', value: '48.2%', icon: Shield },
];

const games = [
  { name: 'Blackjack', desc: 'Classic 21 - beat the dealer', players: '2,341 playing', path: '/app/blackjack' },
  { name: 'Poker', desc: "Texas Hold'em - 6 player tables", players: '1,892 playing', path: '/app/poker' },
  { name: 'Mines', desc: 'Reveal gems, avoid mines', players: '987 playing', path: '/app/mines' },
  { name: 'Roulette', desc: 'European single-zero wheel', players: '1,456 playing', path: '/app/games' },
];

const promos = [
  { title: 'Welcome Bonus', desc: 'Start with 25,000 free chips when you create an account', tag: 'NEW' },
  { title: 'Daily Spin', desc: 'Spin the wheel every 24 hours for bonus chips', tag: 'DAILY' },
  { title: 'VIP Rewards', desc: 'Climb tiers for exclusive tables and multipliers', tag: 'VIP' },
];

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: '#0E1310' }}>
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-[#2A3A28]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[2px] flex items-center justify-center" style={{ background: '#8B1A1A' }}>
            <Diamond size={16} className="text-[#C8A84B]" />
          </div>
          <span className="text-[#E8E0D0] text-lg" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
            LuckiiPage
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-1.5 text-sm text-[#E8E0D0] border border-[#2A3A28] rounded-[2px] hover:bg-[#1A2119]">
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-1.5 text-sm text-[#E8E0D0] rounded-[2px] hover:bg-[#A02020]" style={{ background: '#8B1A1A' }}>
            Play Free
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1647222148007-f2910658aea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2FzaW5vJTIwdGFibGUlMjBmZWx0JTIwZ3JlZW58ZW58MXx8fHwxNzczODIzMTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, #0E1310 70%)' }} />
        <div className="relative px-6 lg:px-12 py-20 lg:py-32 max-w-3xl">
          <div
            className="inline-block px-3 py-1 mb-4 text-[11px] tracking-widest uppercase rounded-[2px]"
            style={{ background: '#1A3A1A', color: '#4ADE80', fontFamily: "'Barlow', sans-serif" }}
          >
            Free to Play - No Real Money
          </div>
          <h1 className="text-3xl lg:text-5xl text-[#E8E0D0] mb-4" style={{ fontFamily: "'Spectral', serif", fontWeight: 700, lineHeight: 1.15 }}>
            The Casino Experience,
            <br />
            <span className="text-[#C8A84B]">Without the Risk</span>
          </h1>
          <p className="text-[#8A8A7A] text-base lg:text-lg mb-8 max-w-lg" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Premium casino simulator with Blackjack, Poker, Mines and more. Play with virtual chips. Sharpen your
            strategy. Entertainment only.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="px-6 py-2.5 text-sm text-[#E8E0D0] rounded-[2px] hover:bg-[#A02020] flex items-center gap-2"
              style={{ background: '#8B1A1A' }}
            >
              Create Free Account <ChevronRight size={16} />
            </Link>
            <Link to="/app" className="px-6 py-2.5 text-sm text-[#C8A84B] border border-[#C8A84B] rounded-[2px] hover:bg-[#C8A84B]/10">
              Browse Games
            </Link>
          </div>
        </div>
      </section>

      <div className="border-y border-[#2A3A28] grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-4 border-r border-[#2A3A28] last:border-r-0 flex items-center gap-3">
            <s.icon size={20} className="text-[#C8A84B]" />
            <div>
              <div className="text-[#E8E0D0] text-lg" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>
                {s.value}
              </div>
              <div className="text-[#8A8A7A] text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <section className="px-6 lg:px-12 py-12">
        <h2 className="text-[#E8E0D0] text-xl mb-6" style={{ fontFamily: "'Spectral', serif" }}>
          Featured Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {games.map((g) => (
            <Link
              key={g.name}
              to={g.path}
              className="group border border-[#2A3A28] rounded-[4px] overflow-hidden hover:border-[#C8A84B]/30 transition-colors"
              style={{ background: '#1A2119' }}
            >
              <div className="h-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a3a1a 0%, #0E1310 100%)' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-[#2A3A28]" style={{ fontFamily: "'Spectral', serif" }}>
                    {g.name[0]}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <div className="text-[#E8E0D0] text-sm mb-0.5" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
                  {g.name}
                </div>
                <div className="text-[#8A8A7A] text-xs mb-2">{g.desc}</div>
                <div className="text-[10px] text-[#4ADE80]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {g.players}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-12 py-12 border-t border-[#2A3A28]">
        <h2 className="text-[#E8E0D0] text-xl mb-6" style={{ fontFamily: "'Spectral', serif" }}>
          Promotions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {promos.map((p) => (
            <div key={p.title} className="border border-[#2A3A28] rounded-[4px] p-4" style={{ background: '#1A2119' }}>
              <span className="inline-block px-2 py-0.5 text-[10px] tracking-wider uppercase rounded-[2px] mb-3" style={{ background: '#3A3020', color: '#C8A84B' }}>
                {p.tag}
              </span>
              <div className="text-[#E8E0D0] text-sm mb-1" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
                {p.title}
              </div>
              <div className="text-[#8A8A7A] text-xs">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#2A3A28] px-6 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-[2px] flex items-center justify-center" style={{ background: '#8B1A1A' }}>
                <Diamond size={12} className="text-[#C8A84B]" />
              </div>
              <span className="text-[#E8E0D0] text-sm" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
                LuckiiPage
              </span>
            </div>
            <p className="text-[#8A8A7A] text-xs max-w-sm">
              LuckiiPage is for entertainment only. No real money. No gambling. All games use virtual currency with no
              real-world value.
            </p>
          </div>
          <div className="flex gap-8 text-xs text-[#8A8A7A]">
            <div className="space-y-1.5">
              <div className="text-[#E8E0D0] text-[10px] uppercase tracking-wider mb-2">Games</div>
              <div>Blackjack</div>
              <div>Poker</div>
              <div>Mines</div>
            </div>
            <div className="space-y-1.5">
              <div className="text-[#E8E0D0] text-[10px] uppercase tracking-wider mb-2">Legal</div>
              <div>Terms of Service</div>
              <div>Privacy Policy</div>
              <div>Responsible Play</div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-[#2A3A28] text-[10px] text-[#8A8A7A]">
          © 2026 LuckiiPage. Entertainment only. Not a real gambling platform.
        </div>
      </footer>
    </div>
  );
}
