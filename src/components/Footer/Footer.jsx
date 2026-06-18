import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" id="footer">
      <div className="footer__divider" aria-hidden="true" />

      <div className="container footer__inner">
        <div className="footer__brand">
          <a className="footer__logo" href="#home">
            <span className="footer__logo-mark" aria-hidden="true" />
            Black Bulls
          </a>
          <p className="footer__tagline">
            Progress Through FXNX Partner Ranks and Unlock New Rewards. Progress Through FXNX Partner
            Ranks.
          </p>
        </div>

        <div className="footer__news">
          <p className="footer__news-title">Stay up to date</p>
          <form
            className="footer__form"
            onSubmit={e => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <input
              className="footer__input"
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              required
            />
            <button className="footer__subscribe" type="submit">
              Subscribe
            </button>
          </form>
          <p className="footer__consent">
            By subscribing you agree to with our <strong>Privacy Policy</strong>
          </p>
        </div>
      </div>

      <div className="footer__divider" aria-hidden="true" />

      <div className="container footer__bottom">
        <span>{year} your company — all rights reserved</span>
      </div>
    </footer>
  );
}
