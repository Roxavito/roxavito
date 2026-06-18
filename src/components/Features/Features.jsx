import SpotlightCard from '../../reactbits/SpotlightCard/SpotlightCard.jsx';
import './Features.css';

const FEATURES = [
  { title: 'Money-back guarantee', desc: 'Pinnacle of VIP Trading!', size: 'sm', accent: 'arrow' },
  { title: 'Unlimited Revisions guarantee', desc: 'Pinnacle of VIP Trading!', size: 'lg', accent: 'clock' },
  { title: 'Rush Design Option', desc: 'Pinnacle of VIP Trading!', size: 'lg', accent: 'card' },
  { title: 'Lifetime Support', desc: 'Pinnacle of VIP Trading!', size: 'sm', accent: 'orbit' }
];

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <h2 className="features__intro">
          <span className="features__intro-strong">Experience the</span>{' '}
          <span className="features__intro-dim">World of Forex with Ease and Efficiency</span>
        </h2>

        <div className="section-head features__head">
          <h2>Elite Trading Redefined</h2>
          <p>Black Account: The Pinnacle of VIP Trading!</p>
        </div>

        <div className="features__grid">
          {FEATURES.map(f => (
            <SpotlightCard
              key={f.title}
              className={`feature-card feature-card--${f.size}`}
              spotlightColor="rgba(58, 84, 255, 0.25)"
            >
              <span className="feature-card__badge">No Fees</span>
              <span className={`feature-card__art feature-card__art--${f.accent}`} aria-hidden="true" />
              <div className="feature-card__text">
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
