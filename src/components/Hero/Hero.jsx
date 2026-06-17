import Particles from '../../reactbits/Particles/Particles.jsx';
import CountUp from '../../reactbits/CountUp/CountUp.jsx';
import { ASSETS } from '../../assets.js';
import './Hero.css';

function Sparkle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        d="M12 0c.7 5.6 5.7 10.6 12 11.3C17.7 12 12.7 17 12 24c-.7-7-5.7-12-12-12.7C6.3 10.6 11.3 5.6 12 0Z"
        fill="url(#sparkle-grad)"
      />
      <defs>
        <linearGradient id="sparkle-grad" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0.35" stopColor="#ffffff" />
          <stop offset="1" stopColor="#797979" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__particles" aria-hidden="true">
        <Particles
          particleCount={420}
          particleSpread={16}
          speed={0.06}
          particleBaseSize={70}
          alphaParticles
          disableRotation={false}
          moveParticlesOnHover
          particleHoverFactor={0.6}
          particleColors={['#ffffff', '#9fb0ff', '#3a54ff']}
        />
      </div>

      <div className="hero__photo" aria-hidden="true">
        <img src={ASSETS.bullPhoto} alt="" loading="eager" />
        <div className="hero__photo-fade" />
      </div>

      <div className="hero__inner container">
        <div className="hero__headline">
          <h1 className="hero__title grad-text">Black Bulls</h1>
          <img className="hero__title-bull" src={ASSETS.headlineBull} alt="" aria-hidden="true" />
          <p className="hero__subtitle">Design Agency</p>
        </div>

        <aside className="info-card">
          <span className="info-card__line" aria-hidden="true" />
          <p className="info-card__text">
            Driven by creativity and guided by logic, <em>Black Bulls</em> builds digital products where every
            detail matters—bold, functional, and unforgettable.
          </p>
          <div className="info-card__img">
            <img src={ASSETS.infoSharp} alt="Black Bulls product showcase" />
          </div>
        </aside>

        <div className="hero__bottom">
          <div className="hero__desc">
            <div className="hero__sparkles">
              <Sparkle className="sparkle sparkle--lg" />
              <Sparkle className="sparkle sparkle--sm" />
            </div>
            <p className="hero__desc-title grad-text">100% design precision.</p>
            <p className="hero__desc-sub">Trusted by startups and enterprises</p>
          </div>

          <a className="hero__cta" href="#book">
            Book a 15-min Meeting
          </a>

          <div className="hero__stats">
            <p className="hero__stats-value grad-text">
              +<CountUp to={300} duration={2.4} />
            </p>
            <p className="hero__stats-label">Real clients</p>
            <p className="hero__stats-desc">
              Proven success in UI/UX — with projects that speak for themselves
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
