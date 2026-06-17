import { ASSETS } from '../../assets.js';
import './BookCta.css';

const TAGS = [
  { label: 'Durable Construction', x: '8%', y: '34%' },
  { label: 'Durable Construction', x: '82%', y: '30%' },
  { label: 'Durable Construction', x: '18%', y: '74%' },
  { label: 'Durable Construction', x: '78%', y: '76%' }
];

export default function BookCta() {
  return (
    <section className="book" id="book">
      <div className="container">
        <div className="book__panel">
          <img className="book__bg" src={ASSETS.heroBg} alt="" aria-hidden="true" />
          <div className="book__overlay" />

          {TAGS.map((t, i) => (
            <span key={i} className="book__tag" style={{ left: t.x, top: t.y }}>
              <span className="book__tag-dot" />
              {t.label}
            </span>
          ))}

          <div className="book__content">
            <h2 className="book__title grad-text">Let&rsquo;s Book</h2>
            <a className="book__cta" href="#">
              A Meeting With us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
