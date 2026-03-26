import Hero from "../components/HomePage/Hero";
import About from "../components/HomePage/About";
import KeyFeatures from "../components/HomePage/KeyFeatures";
import HowItWorks from "../components/HomePage/HowItWorks";
import RedirectTo from "../components/HomePage/RedirectTo";
import FeaturedHotels from "../components/HomePage/FeaturedHotels";

export default function HomePage() {
  return (
    <>

      {/* Hero section */}
      <Hero />

      {/* Hôtels en vedette */}
      <FeaturedHotels />

      {/* Key Features section */}
      <KeyFeatures />

      {/*How It Works section */}
      <HowItWorks />

      {/* Redirect To section */}
      <RedirectTo />

      {/* About section */}
      <About />
    </>
  );
}
