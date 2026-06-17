import Navbar from './components/Navbar/Navbar.jsx';
import Hero from './components/Hero/Hero.jsx';
import Experience from './components/Experience/Experience.jsx';
import EliteTrading from './components/EliteTrading/EliteTrading.jsx';
import HelpSelect from './components/HelpSelect/HelpSelect.jsx';
import Services from './components/Services/Services.jsx';
import BookCta from './components/BookCta/BookCta.jsx';
import Footer from './components/Footer/Footer.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <EliteTrading />
        <HelpSelect />
        <Services />
        <BookCta />
      </main>
      <Footer />
    </>
  );
}
