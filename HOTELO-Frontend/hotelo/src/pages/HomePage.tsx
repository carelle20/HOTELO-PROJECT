// import Navbar from "../components/Navbar";
import Hero from "../components/HomePage/Hero";
// import Footer from "../components/Footer";
import About from "../components/HomePage/About";
import KeyFeatures from "../components/HomePage/KeyFeatures";
import HowItWorks from "../components/HomePage/HowItWorks";
import RedirectTo from "../components/HomePage/RedirectTo";

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      {/* <Navbar /> */}

      {/* Hero section */}
      <Hero />

      {/* Key Features section */}
      <KeyFeatures />

      {/*How It Works section */}
      <HowItWorks />

      {/* Redirect To section */}
      <RedirectTo />

      {/* About section */}
      <About />

      {/* Footer */}
      {/* <Footer /> */}
    </>
  );
}
