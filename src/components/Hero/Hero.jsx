import DotField from '../../reactbits/DotField/DotField.jsx';
import HeroBand from '../../reactbits/HeroBand/HeroBand.jsx';
import './Hero.css';

export default function Hero() {
  return (
    <section className="ln-hero">
      <DotField
        dotRadius={1.5}
        dotSpacing={14}
        cursorRadius={500}
        cursorForce={0.1}
        bulgeOnly
        bulgeStrength={67}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom="rgba(168, 85, 247, 0.35)"
        gradientTo="rgba(180, 151, 255, 0.25)"
      />
      <HeroBand
        className="ln-hero-band"
        color="#A855F7"
        speed={0.2}
        frequency={1}
        noise={0.15}
        bandWidth={0.14}
        rotation={90}
        fadeTop={0.75}
        iterations={1}
        intensity={1.25}
        scale={1}
        warpStrength={1}
        yOffset={0.3}
        mouseInfluence={0.3}
      />

      <svg className="ln-hero-bottom-fade" preserveAspectRatio="none" viewBox="0 0 1 1">
        <defs>
          <linearGradient id="hero-bottom-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#120F17" stopOpacity="0" />
            <stop offset="50%" stopColor="#120F17" stopOpacity="0" />
            <stop offset="60%" stopColor="#120F17" stopOpacity="0.03" />
            <stop offset="68%" stopColor="#120F17" stopOpacity="0.1" />
            <stop offset="74%" stopColor="#120F17" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#120F17" stopOpacity="0.38" />
            <stop offset="85%" stopColor="#120F17" stopOpacity="0.55" />
            <stop offset="90%" stopColor="#120F17" stopOpacity="0.72" />
            <stop offset="94%" stopColor="#120F17" stopOpacity="0.87" />
            <stop offset="97%" stopColor="#120F17" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#120F17" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="1" height="1" fill="url(#hero-bottom-fade)" />
      </svg>

      <div className="ln-hero-content">
        <a className="ln-hero-tag" href="#">
          <span className="ln-hero-tag-new">New</span>
          Forex-ready websites
          <svg viewBox="0 0 16 16" width="10" height="10" fill="none" aria-hidden="true">
            <path d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <h1 className="ln-hero-headline">
          <span className="ln-hero-headline-line">Digital products for</span>
          <br />
          <span className="ln-hero-headline-line gradient-title">ambitious brands</span>
        </h1>

        <p className="ln-hero-description">
          Bold, functional &amp; unforgettable websites and interfaces that drop into your brand and
          instantly make it stand out.
        </p>

        <div className="ln-hero-buttons">
          <a className="ln-hero-btn ln-hero-btn-primary" href="#">
            Browse Work
          </a>
          <a className="ln-hero-btn ln-hero-btn-ghost" href="#">
            Book a Meeting
          </a>
        </div>
      </div>
    </section>
  );
}
