import Navbar from "../components/HomePage/Navbar";
import Footer from "../components/HomePage/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}