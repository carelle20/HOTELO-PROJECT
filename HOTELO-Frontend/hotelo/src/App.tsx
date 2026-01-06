import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./components/HomePage/About";
import Navbar from "./components/HomePage/Navbar";
import Footer from "./components/HomePage/Footer";
import HowItWorks from "./components/HomePage/HowItWorks";
import DiscoverHotels from "./pages/DiscoverHotels";
import HotelDetails from "./pages/HotelsDetails";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/discover" element={<DiscoverHotels />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
