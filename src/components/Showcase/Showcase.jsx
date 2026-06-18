import CountUp from '../../reactbits/CountUp/CountUp.jsx';
import './Showcase.css';

const STATS = [
  { to: 300, suffix: '+', label: 'Clients shipped' },
  { to: 130, suffix: '+', label: 'Projects delivered' },
  { to: 12, suffix: '', label: 'Years of craft' },
  { to: 100, suffix: '%', label: 'Design precision' }
];

export default function Showcase() {
  return (
    <section className="showcase">
      <div className="container">
        <div className="section-head">
          <h2>Proof, not promises</h2>
          <p>Numbers from real work, with projects that speak for themselves.</p>
        </div>

        <div className="showcase__stats">
          {STATS.map(s => (
            <div className="stat" key={s.label}>
              <p className="stat__value">
                <CountUp to={s.to} duration={2.2} />
                {s.suffix}
              </p>
              <p className="stat__label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
