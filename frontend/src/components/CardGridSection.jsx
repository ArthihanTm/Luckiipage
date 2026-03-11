import { Link } from 'react-router-dom';

function CardGridSection({ title, subtitle, items, showLink = false }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      <p className="section-sub">{subtitle}</p>

      <div className="grid">
        {items.map((item) => (
          <article key={item.title} className="card">
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {showLink ? <Link to="/dashboard">Play Now</Link> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default CardGridSection;
