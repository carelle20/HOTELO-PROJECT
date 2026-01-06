import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from  "/assets/Hotelo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition
     ${isActive ? "text-yellow-500" : "text-slate-700 hover:text-slate-900"}`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <nav className="mx-auto max-w-7xl px-4">

        <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <NavLink
                to="/"
                className="flex flex-col items-center justify-center leading-none"
                >
                <img
                src={logo}
                alt="HOTELO"
                className="h-12 w-auto object-contain"
                />

                <span className="text-sm font-extrabold text-slate-900">
                    HOT<span className="text-yellow-500">ELO</span>
                </span>
            </NavLink>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {[
              { to: "/", label: "Accueil" },
              { to: "/about", label: "À propos" },
              { to: "/how-it-works", label: "Comment ça marche" },
              { to: "/discover", label: "Découvrir" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass}>
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full scale-x-0 bg-yellow-500 transition-transform group-hover:scale-x-100" />
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Se connecter
            </NavLink>
            <NavLink
              to="/register"
              className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition"
            >
              Inscription
            </NavLink>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1"
          >
            <span className={`h-0.5 w-6 bg-slate-900 transition ${open && "rotate-45 translate-y-1.5"}`} />
            <span className={`h-0.5 w-6 bg-slate-900 transition ${open && "opacity-0"}`} />
            <span className={`h-0.5 w-6 bg-slate-900 transition ${open && "-rotate-45 -translate-y-1.5"}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-4 py-6">
            {[
              { to: "/", label: "Accueil" },
              { to: "/about", label: "À propos" },
              { to: "/how-it-works", label: "Comment ça marche" },
              { to: "/discover", label: "Découvrir" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block text-base font-medium transition ${
                      isActive ? "text-yellow-500" : "text-slate-700 hover:text-slate-900"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            <div className="pt-4 border-t flex flex-col gap-3">
              <NavLink to="/login" onClick={() => setOpen(false)}>
                Se connecter
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setOpen(false)}
                className="rounded-md bg-yellow-500 px-4 py-2 text-center text-white"
              >
                Inscription
              </NavLink>
            </div>
          </ul>
        </div>

      </nav>
    </header>
  );
}
