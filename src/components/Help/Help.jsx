import { useState } from 'react';
import './Help.css';

const ITEMS = [
  {
    q: 'I need a broker website',
    a: 'Conversion-focused brokerage sites with live pricing, onboarding flows, and a brand that earns trust at first glance.'
  },
  {
    q: 'I need an AI website',
    a: 'Sleek product sites for AI tools — clear messaging, animated demos, and a funnel that turns curiosity into sign-ups.'
  },
  {
    q: 'I need a trading dashboard',
    a: 'Data-dense dashboards designed for clarity under pressure: charts, orders, and portfolios that stay readable.'
  },
  {
    q: 'I need a brand identity',
    a: 'Logos, systems, and visual languages that make ambitious brands impossible to ignore.'
  }
];

export default function Help() {
  const [open, setOpen] = useState(0);

  return (
    <section className="help" id="help">
      <div className="container">
        <div className="section-head">
          <h2>I need help in..</h2>
          <p>Black Account: The Pinnacle of VIP Trading!</p>
        </div>

        <div className="help__grid">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <button
                key={item.q}
                type="button"
                className={`help__cell ${isOpen ? 'help__cell--open' : ''}`}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="help__cell-glow" aria-hidden="true" />
                <span className="help__cell-head">
                  <span className="help__cell-q">{item.q}</span>
                  <span className="help__cell-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
                <span className="help__cell-answer">{item.a}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
