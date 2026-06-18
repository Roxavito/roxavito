import './CTA.css';

export default function CTA() {
  return (
    <section className="cta" id="book">
      <div className="container">
        <div className="cta__panel">
          <div className="cta__glow" aria-hidden="true" />
          <div className="cta__stars" aria-hidden="true" />
          <h2 className="cta__title gradient-title">Let&rsquo;s Book</h2>
          <p className="cta__subtitle">
            Black Account: The Pinnacle of VIP Trading. Reserve a 15-minute call and let&rsquo;s
            build something unforgettable.
          </p>
          <a className="cta__btn" href="#footer">
            Book a 15-min Meeting
          </a>
        </div>
      </div>
    </section>
  );
}
