import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../components/HomePage/Footer";
import logo from "/assets/Hotelo.png";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* 1. HEADER */}
      <header className="w-full bg-white border-b border-slate-100 px-6 py-4 md:px-12 flex justify-between items-center shadow-sm">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-2xl font-black text-[#0B1E3A] tracking-tighter"
        >
          <img
            src={logo}
            alt="HOTELO"
            className="h-12 w-auto object-contain"
          />
          <span>
            HOTELO<span className="text-yellow-400">.</span>
          </span>
        </Link>

        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-[#0B1E3A] transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Retour à l'accueil</span>
        </Link>
      </header>

      {/* 2. CONTENU */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {children}
      </main>

      {/* 3. FOOTER */}
      <Footer />
      
    </div>
  );
}