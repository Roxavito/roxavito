import SpotlightCard from '../../reactbits/SpotlightCard/SpotlightCard.jsx';
import './Services.css';

const SERVICES = [
  { top: 'WEBSITE UI', bottom: 'DESIGN', kind: 'desktop' },
  { top: 'WEB DESIGN', bottom: '& DEVELOP', kind: 'phone' },
  { top: 'MOBILE UI', bottom: 'DESIGN', kind: 'mobile' }
];

function Mockup({ kind }) {
  return (
    <div className={`svc__mockup svc__mockup--${kind}`} aria-hidden="true">
      <div className="svc__screen">
        <span className="svc__dot" />
        <span className="svc__bar" />
        <span className="svc__bar svc__bar--short" />
        <div className="svc__tile" />
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section className="services">
      <div className="container">
        <div className="section-head">
          <h2>Our Services</h2>
          <p>Black Account: The Pinnacle of VIP Trading!</p>
        </div>

        <div className="services__grid">
          {SERVICES.map((s, i) => (
            <SpotlightCard key={i} className="svc__card" spotlightColor="rgba(58, 84, 255, 0.3)">
              <h3 className="svc__title">
                {s.top} <span>{s.bottom}</span>
              </h3>
              <a className="svc__more" href="#">
                Read More
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                  <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <Mockup kind={s.kind} />
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
