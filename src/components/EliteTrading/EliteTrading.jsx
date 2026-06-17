import SpotlightCard from '../../reactbits/SpotlightCard/SpotlightCard.jsx';
import './EliteTrading.css';

const FEATURES = [
  {
    title: ['Money-back ', 'guarantee'],
    desc: 'Pinnacle of VIP Trading!',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M14 44 38 20m0 0H22m16 0v16" stroke="url(#g1)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="g1" x1="14" y1="20" x2="44" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9fb6ff" />
            <stop offset="1" stopColor="#3a54ff" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    title: ['Unlimited ', 'Revisions guarantee'],
    desc: 'Pinnacle of VIP Trading!',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="22" stroke="url(#g2)" strokeWidth="4" />
        <path d="M32 18v14l10 6" stroke="url(#g2)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="g2" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9fb6ff" />
            <stop offset="1" stopColor="#3a54ff" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    title: ['Rush ', 'Design Option'],
    desc: 'Pinnacle of VIP Trading!',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="10" y="20" width="44" height="28" rx="6" stroke="url(#g3)" strokeWidth="4" />
        <path d="M10 30h44" stroke="url(#g3)" strokeWidth="4" />
        <circle cx="44" cy="40" r="3" fill="#3a54ff" />
        <defs>
          <linearGradient id="g3" x1="10" y1="20" x2="54" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9fb6ff" />
            <stop offset="1" stopColor="#3a54ff" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    title: ['Lifetime ', 'Support'],
    desc: 'Pinnacle of VIP Trading!',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 12c2.5 4.5 7 5.5 11 5.5-1.5 7-5 11-11 13.5-6-2.5-9.5-6.5-11-13.5 4 0 8.5-1 11-5.5Z" stroke="url(#g4)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M24 36l5 5 11-11" stroke="url(#g4)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="g4" x1="21" y1="12" x2="43" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9fb6ff" />
            <stop offset="1" stopColor="#3a54ff" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
];

export default function EliteTrading() {
  return (
    <section className="elite">
      <div className="container">
        <div className="section-head">
          <h2>Elite Trading Redefined</h2>
          <p>Black Account: The Pinnacle of VIP Trading!</p>
        </div>

        <div className="elite__grid">
          {FEATURES.map(f => (
            <SpotlightCard key={f.title.join('')} className="elite__card" spotlightColor="rgba(58, 84, 255, 0.35)">
              <span className="elite__badge">No Fees</span>
              <div className="elite__card-body">
                <div className="elite__text">
                  <h3 className="elite__title">
                    <strong>{f.title[0]}</strong>
                    {f.title[1]}
                  </h3>
                  <p className="elite__desc">{f.desc}</p>
                </div>
                <div className="elite__icon">{f.icon}</div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
