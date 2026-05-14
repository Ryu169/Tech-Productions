import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Catalog from '../components/Catalog.jsx';
import Projects from '../components/Projects.jsx';
import About from '../components/About.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppFab from '../components/WhatsAppFab.jsx';
import Team from '../components/Team.jsx';

export default function PublicSite() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Catalog />
        <Projects />
        <About />
        <Team />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
