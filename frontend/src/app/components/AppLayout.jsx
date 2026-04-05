import { Outlet, useLocation, Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { LayoutDashboard, Gamepad2, Diamond, Bomb, Spade, Gift } from 'lucide-react';
import { getMe } from '../api/user';
import { normalizeChips } from '../utils/chips';

const BALANCE_KEY = 'luckii_balance';

const mobileNav = [
  { icon: LayoutDashboard, label: 'Lobby', path: '/app' },
  { icon: Gift, label: 'Spin', path: '/app/daily-spin' },
  { icon: Gamepad2, label: 'Games', path: '/app/games' },
  { icon: Diamond, label: 'BJ', path: '/app/blackjack' },
  { icon: Bomb, label: 'Mines', path: '/app/mines' },
  { icon: Spade, label: 'Poker', path: '/app/poker' },
];

export default function AppLayout() {
  const [balance, setBalanceState] = useState(() => {
    const raw = localStorage.getItem(BALANCE_KEY);
    const parsed = raw ? Number(raw) : NaN;
    return normalizeChips(Number.isFinite(parsed) ? parsed : 25000);
  });

  const setBalance = useCallback((update) => {
    setBalanceState((prev) => {
      const prevN = normalizeChips(prev);
      const next = typeof update === 'function' ? update(prevN) : update;
      return normalizeChips(next);
    });
  }, []);
  const location = useLocation();
  const isGamePage = ['/app/blackjack', '/app/mines', '/app/poker'].includes(location.pathname);

  useEffect(() => {
    localStorage.setItem(BALANCE_KEY, String(balance));
  }, [balance]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (!cancelled && typeof me?.chipBalance === 'number') {
          setBalance(me.chipBalance);
        }
      } catch {
        /* guest or expired session — keep local balance */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0E1310' }}>
      <div className="hidden lg:block">
        <Sidebar balance={balance} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar balance={balance} />
        <main className={`flex-1 overflow-auto ${isGamePage ? '' : 'p-4 lg:p-6'}`}>
          <Outlet context={{ balance, setBalance }} />
        </main>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 flex border-t border-[#2A3A28]" style={{ background: '#141C16' }}>
        {mobileNav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[11px] ${
                active ? 'text-[#C8A84B]' : 'text-[#8A8A7A]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
