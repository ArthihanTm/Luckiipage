import { Link } from 'react-router-dom';

const featuredGames = [
  { name: 'Blackjack', description: 'Classic 21 with premium gameplay', icon: 'BJ' },
  { name: 'Mines', description: 'Strategic risk and reward experience', icon: 'MN' },
  { name: 'Slots', description: 'Modern luxury slot machines', icon: 'SL' },
  { name: 'Poker', description: 'Elite table poker simulation', icon: 'PK' },
];

const activity = [
  { game: 'Blackjack', result: 'Win', amount: '+2,400', positive: true },
  { game: 'Slots', result: 'Win', amount: '+5,000', positive: true },
  { game: 'Mines', result: 'Loss', amount: '-800', positive: false },
];

function DashboardPage() {
  return (
    <main className="dashboard-main">
      <section className="dashboard-header">
        <h1>Welcome back, Player!</h1>
        <p>Ready to continue your winning streak?</p>
      </section>

      <section className="dashboard-grid">
        <article className="dash-card dash-highlight">
          <h3>Virtual Balance</h3>
          <p className="dash-balance">25,840</p>
          <span className="dash-positive">+12.5% from yesterday</span>
        </article>

        <article className="dash-card">
          <h3>Daily Reward</h3>
          <p className="dash-day">Day 5</p>
          <div className="dash-progress">
            <span style={{ width: '50%' }} />
          </div>
          <button className="cta" type="button">
            Claim 1,000 Coins
          </button>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-head">
          <h2>Featured Games</h2>
          <Link to="/games">View all</Link>
        </div>
        <div className="dashboard-games">
          {featuredGames.map((game) => (
            <article className="dash-card" key={game.name}>
              <div className="icon">{game.icon}</div>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-head">
          <h2>Recent Activity</h2>
        </div>
        <div className="dashboard-activity">
          {activity.map((item) => (
            <article className="dash-activity-item" key={`${item.game}-${item.amount}`}>
              <div>
                <strong>{item.game}</strong>
                <p>{item.result}</p>
              </div>
              <span className={item.positive ? 'dash-positive' : 'dash-negative'}>{item.amount}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
