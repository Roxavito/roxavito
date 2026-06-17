import BlurText from '../../reactbits/BlurText/BlurText.jsx';
import './Experience.css';

export default function Experience() {
  return (
    <section className="experience">
      <div className="container experience__inner">
        <h2 className="experience__heading">
          <BlurText
            text="Experience the"
            animateBy="words"
            delay={120}
            className="experience__accent"
          />
          <BlurText
            text="World of Forex with Ease and Efficiency"
            animateBy="words"
            delay={90}
            className="experience__dim"
          />
        </h2>
      </div>
    </section>
  );
}
