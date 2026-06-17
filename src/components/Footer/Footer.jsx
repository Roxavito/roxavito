import { useState } from 'react';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    // wire up to your newsletter provider here
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a className="brand" href="#">
            <span className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d="M12 2c1.5 2.5 4 3 6 3-1 4-3 6-6 7-3-1-5-3-6-7 2 0 4.5-.5 6-3Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="brand__text">Black Bulls</span>
          </a>
          <p className="footer__tagline">
            Progress Through FKNX Partner Ranks and Unlock New Rewards
          </p>
        </div>

        <div className="footer__news">
          <p className="footer__news-title">Stay up to date</p>
          <form className="footer__form" onSubmit={onSubmit}>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
          </form>
          <p className="footer__fineprint">
            By subscribing you agree to our <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Black Bulls. All rights reserved.</span>
      </div>
    </footer>
  );
}
