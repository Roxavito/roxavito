import SpotlightCard from '../../reactbits/SpotlightCard/SpotlightCard.jsx';
import './Features.css';

const FEATURES = [
  {
    title: 'Brand & Identity',
    desc: "Logos, systems, and visual languages that make ambitious brands impossible to ignore."
  },
  {
    title: 'Web & Product Design',
    desc: "Marketing sites and product UIs designed to convert — fast, clear, and unmistakably yours."
  },
  {
    title: 'Motion & Interaction',
    desc: "Micro-interactions and animated experiences that make every scroll feel alive."
  },
  {
    title: 'Design to Code',
    desc: "Pixel-faithful builds in React. What you approve in design is exactly what ships."
  },
  {
    title: 'Built to Scale',
    desc: "Reusable components and clean systems so your product grows without the chaos."
  },
  {
    title: 'Trusted Delivery',
    desc: "300+ clients, proven results. Beautiful work, shipped on time, every time."
  }
];

export default function Features() {
  return (
    <section className="features">
      <div className="container">
        <div className="section-head">
          <h2>What&rsquo;s inside</h2>
          <p>Everything an ambitious brand needs — design, motion, and code in one place.</p>
        </div>

        <div className="features__grid">
          {FEATURES.map(f => (
            <SpotlightCard key={f.title} className="feature-card" spotlightColor="rgba(168, 85, 247, 0.25)">
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
