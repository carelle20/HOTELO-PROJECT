import { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "/assets/Hotelo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  const sections = useMemo(() => ["hero", "how-it-works", "about", "key-features"], []);

  // Intersection Observer pour détecter la section au scroll
  useEffect(() => {
    if (location.pathname !== "/") return;

    const observerOptions = {
      root: null,
      threshold: 0.2, // On détecte plus tôt pour plus de réactivité
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Quand on entre dans une section, elle devient active
          setActiveSection(entry.target.id);
        } else {
          // Quand on sort d'une section (entry.target.id), 
          // on vérifie si c'est celle qui était active. Si oui, on remet à vide.
          setActiveSection((prev) => (prev === entry.target.id ? "" : prev));
        }
      });
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname, sections]);

  // Fonction pour déterminer la couleur du lien
  const getLinkClass = (to: string, isActive: boolean) => {
    const baseClass = "relative text-sm font-medium transition ";
    
    // Cas particulier : on est sur la page d'accueil
    if (location.pathname === "/") {
      const sectionId = to.replace("/", ""); 
      
      // Si on détecte une section active, on l'allume
      if (activeSection !== "" && activeSection === sectionId) {
        return baseClass + "text-yellow-500";
      }
      
      // Si on est en haut de page ou sur la section "hero", on allume "Accueil"
      if (to === "/" && (activeSection === "hero" || activeSection === "")) {
        return baseClass + "text-yellow-500";
      }

      // Par défaut sur l'accueil pour les autres liens non actifs au scroll
      return baseClass + "text-slate-700 hover:text-slate-900";
    }

    // Cas standard : on est sur une autre page 
    return baseClass + (isActive ? "text-yellow-500" : "text-slate-700 hover:text-slate-900");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm">
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <NavLink to="/" className="flex flex-col items-center justify-center leading-none">
            <img src={logo} alt="HOTELO" className="h-12 w-auto object-contain" />
            <span className="text-sm font-extrabold text-slate-900">
              HOT<span className="text-yellow-500">ELO</span> DGC
            </span>
          </NavLink>

          {/* Liens de navigation */}
          <ul className="hidden md:flex items-center gap-8">
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
                  className={({ isActive }) => getLinkClass(link.to, isActive)}
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full scale-x-0 bg-yellow-500 transition-transform group-hover:scale-x-100" />
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions d'authentification */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/connexion" 
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Se connecter
            </NavLink>
            <NavLink
              to="/inscription"
              className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition"
            >
              S'inscrire
            </NavLink>
          </div>

          {/* Bouton menu sur mobile */}
          <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1 cursor-pointer">
            <span className={`h-0.5 w-6 bg-slate-900 transition ${open && "rotate-45 translate-y-1.5"}`} />
            <span className={`h-0.5 w-6 bg-slate-900 transition ${open && "opacity-0"}`} />
            <span className={`h-0.5 w-6 bg-slate-900 transition ${open && "-rotate-45 -translate-y-1.5"}`} />
          </button>
        </div>

        {/* Contenu du menu sur mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
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
                  className={({ isActive }) => `block text-base font-medium transition ${getLinkClass(link.to, isActive)}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            <div className="text-slate-700 hover:text-slate-900 font-semibold pt-4 border-t border-slate-200 flex flex-col gap-3">
              <NavLink to="/connexion" onClick={() => setOpen(false)}>
                Se connecter
              </NavLink>
              <NavLink
                to="/inscription"
                onClick={() => setOpen(false)}
                className="rounded-md bg-yellow-500 px-4 py-2 text-center text-white"
              >
                S'inscrire
              </NavLink>
            </div>
          </ul>
        </div>
      </nav>
    </header>
  );
}