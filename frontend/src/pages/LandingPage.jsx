import HeroSection from '../components/HeroSection';
import CardGridSection from '../components/CardGridSection';
import FaqSection from '../components/FaqSection';
import { features, games } from '../data/siteContent';

function LandingPage() {
  return (
    <main>
      <HeroSection />
      <CardGridSection
        title="Featured Games"
        subtitle="Four premium games, all with virtual coins. Pick your favorite and start playing."
        items={games}
        showLink
      />
      <CardGridSection
        title="Why LuckiiPage"
        subtitle="Built for fun, competition, and safe play with virtual coins only."
        items={features}
      />
      <FaqSection />
    </main>
  );
}

export default LandingPage;
