import { createBrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GameSelection from './pages/GameSelection';
import Blackjack from './pages/Blackjack';
import Mines from './pages/Mines';
import Poker from './pages/Poker';
import DailySpin from './pages/DailySpin';
import AppLayout from './components/AppLayout';

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  {
    path: '/app',
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'games', Component: GameSelection },
      { path: 'blackjack', Component: Blackjack },
      { path: 'mines', Component: Mines },
      { path: 'poker', Component: Poker },
      { path: 'daily-spin', Component: DailySpin },
    ],
  },
]);
