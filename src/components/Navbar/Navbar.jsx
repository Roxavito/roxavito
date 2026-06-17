import { useEffect, useState } from 'react';
import ShinyText from '../../reactbits/ShinyText/ShinyText.jsx';
import './Navbar.css';

const LINKS = ['Home', 'Products', 'Comunity', 'Careers', 'About us'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
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

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((label, i) => (
            <a key={label} href="#" className={`nav-links__item ${i === 0 ? 'is-active' : ''}`}>
              {label}
            </a>
          ))}
        </nav>

        <a className="btn-get-started" href="#">
          <ShinyText text="Get Started" speed={3} color="#1b1a1a" shineColor="#5b5b5b" />
        </a>
      </div>
    </header>
  );
}
