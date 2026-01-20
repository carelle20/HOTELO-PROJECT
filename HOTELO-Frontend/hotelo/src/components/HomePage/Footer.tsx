import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,

} from "react-icons/fa";
import { 
  FiMail, 
  FiPhone, 
  FiX, 
  FiMessageSquare, 
  FiHelpCircle, 
  FiHome, 
  FiInfo, 
  FiMap, 
  FiSettings, 
  FiFileText, 
  FiEyeOff, 
  FiShield, 
  FiPieChart 
} from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";

import logo from "/assets/Hotelo.png";

const socialLinks = [
  { 
    icon: <FaFacebookF />, 
    url: "https://www.facebook.com/DGC", 
    label: "Facebook", 
    color: "text-[#1877F2]", 
    hoverColor: "hover:text-[#4267B2]" 
  },
  { 
    icon: <FiX />, 
    url: "https://x.com/DGC", 
    label: "X", 
    color: "text-white", 
    hoverColor: "hover:text-gray-300" 
  },
  { 
    icon: <FaInstagram />, 
    url: "https://www.instagram.com/DGC", 
    label: "Instagram", 
    color: "text-[#E4405F]", 
    hoverColor: "hover:text-[#fd1d1d]" 
  },
  { 
    icon: <FaLinkedinIn />, 
    url: "https://www.linkedin.com/company/DGC", 
    label: "LinkedIn", 
    color: "text-[#0A66C2]", 
    hoverColor: "hover:text-[#004182]" 
  },
  { 
    icon: <FaYoutube />, 
    url: "https://www.youtube.com/@DGC", 
    label: "YouTube", 
    color: "text-[#FF0000]", 
    hoverColor: "hover:text-[#cc0000]" 
  },
];

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  // Logique pour afficher/masquer le bouton selon le scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  return (
    <footer className="bg-slate-900 text-gray-800 pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Logo + slogan */}
        <div className="col-span-2">
          <NavLink to="/" className="flex items-center gap-2">
            <img src={logo} alt="HOTELO" className="h-12 w-auto object-contain" />
            <span className="text-sm font-extrabold text-yellow-500">HOTELO DGC</span>
          </NavLink>

          <p className="mt-4 text-sm text-white leading-relaxed">
            Le séjour parfait à portée de main. <br />
            Gérez vos hôtels et simplifiez vos réservations <br />
            partout au Cameroun.
          </p>

          {/* Réseaux sociaux */}
          <div className="flex gap-5 text-2xl mt-6">
            {socialLinks.map(({ icon, url, label, color, hoverColor }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`${color} ${hoverColor} transition-all duration-300 transform hover:-translate-y-1.5`}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Colonne 1 : Lien direct */}
        <div>
          <h3 className="font-semibold text-yellow-500 mb-4 uppercase tracking-wider">Raccourcis</h3>
          <ul className="space-y-3 text-sm text-white">
            <li className="flex items-center gap-3 group">
              <FiHome className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/" className="hover:text-yellow-500 transition">Accueil</Link>
              </li>
            <li className="flex items-center gap-3 group">
              <FiInfo className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/about" className="hover:text-yellow-500 transition">À propos</Link>
              </li>
            <li className="flex items-center gap-3 group">
              <FiMap className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/discover" className="hover:text-yellow-500 transition">Decouvrir</Link>
              </li>
            <li className="flex items-center gap-3 group">
              <FiSettings className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/how-it-works" className="hover:text-yellow-500 transition">Comment ça marche</Link>
            </li>
          </ul>
        </div>

        {/* Colonne 2 : Assistance */}
        <div>
          <h3 className="font-semibold text-yellow-500 mb-4 uppercase tracking-wider">Support</h3>
          <ul className="space-y-3 text-sm text-white">
            <li className="flex items-center gap-3 group">
              <FiMessageSquare className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/contact" className="hover:text-yellow-500 transition">Contact</Link>
            </li>
            
            <li className="flex items-center gap-3 group">
              <FiHelpCircle className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/faq" className="hover:text-yellow-500 transition">FAQ</Link>
            </li>

            <li className="flex items-start gap-3 group">
              <FiMail className="text-yellow-500 text-lg mt-0.5 group-hover:scale-110 transition" />
              <a href="mailto:info@digitalgenerationacademy.com" className="hover:text-yellow-500 transition break-all">
                info@digitalgenerationacademy.com
              </a>
            </li>

            <li className="flex items-center gap-3 group">
              <FiPhone className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <a href="tel:+237651369877" className="hover:text-yellow-500 transition">
                +237 651 36 98 77
              </a>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Confidentialite */}
        <div>
          <h3 className="font-semibold text-yellow-500 mb-4 uppercase tracking-wider">Légal</h3>
          <ul className="space-y-3 text-sm text-white">
            <li className="flex items-center gap-3 group">
              <FiFileText className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/terms" className="hover:text-yellow-500 transition">Conditions d'utilisation</Link>
              </li>
            <li className="flex items-center gap-3 group">
              <FiShield className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/privacy" className="hover:text-yellow-500 transition">Confidentialité</Link>
              </li>
            <li className="flex items-center gap-3 group">
              <FiEyeOff className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/security" className="hover:text-yellow-500 transition">Sécurité</Link>
              </li>
            <li className="flex items-center gap-3 group">
              <FiPieChart className="text-yellow-500 text-lg group-hover:scale-110 transition" />
              <Link to="/cookies" className="hover:text-yellow-500 transition">Cookies</Link>
              </li>
          </ul>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 flex flex-col md:flex-row items-center justify-center border-t border-gray-800 pt-6 pb-8 text-xs md:text-sm text-gray-400 gap-4">
        <span className="text-white italic">© 2026 HOTELO DGC. Tous droits réservés.</span>

        {/* <span className="font-extrabold text-yellow-500 tracking-widest">
          FROM DGC
        </span> */}

        {/* Scroll to top */}
        <a
        href="#top"
        className={`fixed bottom-8 right-8 bg-yellow-500 text-slate-900 w-12 h-12 rounded-full flex justify-center items-center text-2xl shadow-2xl z-50 transition-all duration-300 hover:bg-gray-400 hover:scale-110 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        ↑
      </a>
      </div>
    </footer>
  );
}