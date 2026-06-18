import './Services.css';

const SERVICES = [
  { title: 'Website UI Design', device: 'laptop' },
  { title: 'Web Design & Develop', device: 'phone' },
  { title: 'Mobile UI Design', device: 'laptop' }
];

function ReadMore() {
  return (
    <a className="service-card__more" href="#footer">
      Read More
      <svg viewBox="0 0 8 12" width="6" height="9" fill="none" aria-hidden="true">
        <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-head">
          <h2>Our Services</h2>
          <p>Black Account: The Pinnacle of VIP Trading!</p>
        </div>

        <div className="services__grid">
          {SERVICES.map(s => (
            <article className="service-card" key={s.title}>
              <h3 className="service-card__title">{s.title}</h3>
              <span className="service-card__glow" aria-hidden="true" />
              <span className={`service-card__device service-card__device--${s.device}`} aria-hidden="true">
                <span className="service-card__screen" />
              </span>
              <ReadMore />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
