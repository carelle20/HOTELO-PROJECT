import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ManagerRoutes } from "./routes/ManagerRoutes";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import HomePage from "./pages/HomePage";
import About from "./components/HomePage/About";
import HowItWorks from "./components/HomePage/HowItWorks";
import DiscoverHotels from "./pages/DiscoverHotels";
import HotelDetails from "./pages/HotelsDetails";
import Contact from "./pages/Contact";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Reservation from "./pages/Reserver";
import { Toaster } from "sonner";
import { AdminRoutes } from "./routes/AdminRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* PAGES AVEC LE MAINLAYOUT */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/how-it-works" element={<MainLayout><HowItWorks /></MainLayout>} />
        <Route path="/discover" element={<MainLayout><DiscoverHotels /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/hotels/:id" element={<MainLayout><HotelDetails /></MainLayout>} />
        <Route path="/reserver/:id" element={<MainLayout><Reservation /></MainLayout>} />

        {/* PAGES AVEC LE AUTHLAYOUT */}
        <Route path="/connexion" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/inscription" element={<AuthLayout><Register /></AuthLayout>} />

        {/* ROUTES HOTEL MANAGER */}
        {ManagerRoutes}

        {/* ROUTES ADMIN */}
        {AdminRoutes}
        

      </Routes>
    </BrowserRouter>
  );
}