import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="hero">
      <p className="hero-chip">Virtual Casino Simulation - No Real Money</p>
      <h1>
        Play Smart.
        <br />
        <span>Win Virtual.</span>
      </h1>
      <p className="hero-sub">
        Experience premium casino games with virtual coins. No real money, no risk - just pure
        entertainment and competition.
      </p>
      <div className="hero-actions">
        <Link className="cta large" to="/dashboard">
          Play Now
        </Link>
        <Link className="secondary large" to="/games">
          Explore Games
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
