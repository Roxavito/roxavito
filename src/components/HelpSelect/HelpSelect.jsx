import './HelpSelect.css';

const OPTIONS = [
  'I need a broker website',
  'I need an ai website',
  'I need a broker website',
  'I need an ai website'
];

export default function HelpSelect() {
  return (
    <section className="help">
      <div className="container">
        <div className="section-head">
          <h2>I need help in..</h2>
          <p>Black Account: The Pinnacle of VIP Trading!</p>
        </div>

        <div className="help__grid">
          {OPTIONS.map((label, i) => (
            <button key={i} className="help__option" type="button">
              <span>{label}</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
