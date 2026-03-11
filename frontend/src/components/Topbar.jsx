import { navItems } from '../data/siteContent';
import { Link, NavLink } from 'react-router-dom';

function Topbar() {
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <div className="brand-badge">L</div>
        <span className="brand-text">
          Luckii<span>Page</span>
        </span>
      </Link>

      <nav className="nav">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="topbar-actions">
        <button className="coin-pill" type="button">
          25,000
        </button>
        <button className="profile-pill" type="button">
          U
        </button>
        <Link className="cta" to="/dashboard">
          Play Now
        </Link>
      </div>
    </header>
  );
}

export default Topbar;
