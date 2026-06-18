import DotField from '../../reactbits/DotField/DotField.jsx';
import HeroBand from '../../reactbits/HeroBand/HeroBand.jsx';
import CountUp from '../../reactbits/CountUp/CountUp.jsx';
import './Hero.css';

export default function Hero() {
  return (
    <section className="ln-hero" id="home">
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
        gradientFrom="rgba(58, 84, 255, 0.35)"
        gradientTo="rgba(98, 182, 255, 0.25)"
      />
      <HeroBand
        className="ln-hero-band"
        color="#3A54FF"
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
            <stop offset="0%" stopColor="#010101" stopOpacity="0" />
            <stop offset="50%" stopColor="#010101" stopOpacity="0" />
            <stop offset="60%" stopColor="#010101" stopOpacity="0.03" />
            <stop offset="68%" stopColor="#010101" stopOpacity="0.1" />
            <stop offset="74%" stopColor="#010101" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#010101" stopOpacity="0.38" />
            <stop offset="85%" stopColor="#010101" stopOpacity="0.55" />
            <stop offset="90%" stopColor="#010101" stopOpacity="0.72" />
            <stop offset="94%" stopColor="#010101" stopOpacity="0.87" />
            <stop offset="97%" stopColor="#010101" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#010101" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="1" height="1" fill="url(#hero-bottom-fade)" />
      </svg>

      <div className="ln-hero-content">
        <span className="ln-hero-pill">
          Design Agency
          <span className="ln-hero-pill-mark" aria-hidden="true" />
        </span>

        <h1 className="ln-hero-wordmark gradient-title">Black Bulls</h1>

        <p className="ln-hero-blurb">
          Driven by creativity and guided by logic, <strong>Black Bulls</strong> builds digital
          products where every detail matters—bold, functional, and unforgettable.
        </p>

        <div className="ln-hero-stats">
          <div className="ln-hero-stat ln-hero-stat--left">
            <p className="ln-hero-stat-value">
              <CountUp to={100} duration={2} />%<span> design precision.</span>
            </p>
            <p className="ln-hero-stat-label">Trusted by startups and enterprises</p>
          </div>

          <a className="ln-hero-cta" href="#footer">
            Book a 15-min Meeting
          </a>

          <div className="ln-hero-stat ln-hero-stat--right">
            <p className="ln-hero-stat-value ln-hero-stat-value--num">
              +<CountUp to={300} duration={2.2} />
              <span className="ln-hero-stat-tag">Real clients</span>
            </p>
            <p className="ln-hero-stat-label">
              Proven success in UI/UX — with projects that speak for themselves
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
