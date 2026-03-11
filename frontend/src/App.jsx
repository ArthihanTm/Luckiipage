import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Topbar from './components/Topbar';
import SiteFooter from './components/SiteFooter';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <div className="page">
      <Topbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/games" element={<PlaceholderPage title="Games" />} />
        <Route path="/leaderboard" element={<PlaceholderPage title="Leaderboard" />} />
        <Route path="/rewards" element={<PlaceholderPage title="Rewards" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter />
    </div>
  );
}

export default App;
