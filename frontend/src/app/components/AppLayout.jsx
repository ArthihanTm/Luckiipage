import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { LayoutDashboard, Gamepad2, Diamond, Bomb, Spade } from 'lucide-react';

const mobileNav = [
  { icon: LayoutDashboard, label: 'Lobby', path: '/app' },
  { icon: Gamepad2, label: 'Games', path: '/app/games' },
  { icon: Diamond, label: 'Blackjack', path: '/app/blackjack' },
  { icon: Bomb, label: 'Mines', path: '/app/mines' },
  { icon: Spade, label: 'Poker', path: '/app/poker' },
];

export default function AppLayout() {
  const [balance] = useState(25000);
  const location = useLocation();
  const isGamePage = ['/app/blackjack', '/app/mines', '/app/poker'].includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0E1310' }}>
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar balance={balance} />
        <main className={`flex-1 overflow-auto ${isGamePage ? '' : 'p-4 lg:p-6'}`}>
          <Outlet />
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
