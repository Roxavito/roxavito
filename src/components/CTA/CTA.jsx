import './CTA.css';

export default function CTA() {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta__panel">
          <div className="cta__glow" aria-hidden="true" />
          <h2 className="cta__title gradient-title">Stop building from scratch.</h2>
          <p className="cta__subtitle">
            Bold, functional, unforgettable digital products you can launch with confidence.
            Let&rsquo;s make yours.
          </p>
          <div className="cta__actions">
            <a className="btn btn-primary" href="#">
              Book a 15-min Meeting
            </a>
            <a className="btn btn-ghost" href="#">
              View our work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
