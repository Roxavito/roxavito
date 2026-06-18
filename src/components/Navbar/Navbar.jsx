import { useEffect, useState } from 'react';
import './Navbar.css';

const LINKS = [
  { label: 'Home', href: '#home', active: true },
  { label: 'Products', href: '#services' },
  { label: 'Comunity', href: '#help' },
  { label: 'Careers', href: '#services' },
  { label: 'About us', href: '#footer' }
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
        <a className="nav__logo" href="#home">
          <span className="nav__logo-mark" aria-hidden="true" />
          Black Bulls
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map(l => (
            <a
              key={l.label}
              href={l.href}
              className={`nav__link ${l.active ? 'nav__link--active' : ''}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a className="nav__cta" href="#footer">
          Get Started
        </a>
      </div>
    </header>
  );
}
