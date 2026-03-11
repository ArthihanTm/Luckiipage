import { useMemo } from 'react';
import { footerGroups } from '../data/siteContent';
import { Link } from 'react-router-dom';

function SiteFooter() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer">
      <div className="footer-brand">
        <div className="brand">
          <div className="brand-badge">L</div>
          <span className="brand-text">
            Luckii<span>Page</span>
          </span>
        </div>
        <p>Premium casino simulation. Virtual coins only - no real money, no real gambling.</p>
      </div>

      {footerGroups.map((group) => (
        <div key={group.title} className="footer-col">
          <h4>{group.title}</h4>
          {group.items.map((item) =>
            item.isLink ? (
              <Link key={item.label} to={item.path || '/'}>
                {item.label}
              </Link>
            ) : (
              <p key={item.label}>{item.label}</p>
            ),
          )}
          {group.title === 'LEGAL' ? <p>{year} LuckiiPage</p> : null}
        </div>
      ))}
    </footer>
  );
}

export default SiteFooter;
