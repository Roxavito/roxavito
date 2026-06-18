import Navbar from './components/Navbar/Navbar.jsx';
import Hero from './components/Hero/Hero.jsx';
import Features from './components/Features/Features.jsx';
import Showcase from './components/Showcase/Showcase.jsx';
import CTA from './components/CTA/CTA.jsx';
import Footer from './components/Footer/Footer.jsx';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
