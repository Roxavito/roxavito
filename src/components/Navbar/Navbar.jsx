import { useEffect, useState } from 'react';
import './Navbar.css';

const LINKS = [
  { label: 'Services', href: '#' },
  { label: 'Showcase', href: '#' },
  { label: 'About', href: '#' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <div className="nav__left">
          <a className="nav__logo" href="#">
            <span className="nav__logo-mark" aria-hidden="true" />
            Black Bulls
          </a>
          <span className="nav__slash" aria-hidden="true">
            /
          </span>
          <nav className="nav__links" aria-label="Primary">
            {LINKS.map(l => (
              <a key={l.label} href={l.href} className="nav__link">
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="nav__right">
          <a className="nav__pill" href="#" aria-label="Star on GitHub">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
            </svg>
            <span>Star</span>
          </a>
          <a className="nav__cta btn btn-primary" href="#">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
