"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Composant Header - Navigation principale du site
 * Fonctionnalités :
 * - Navigation responsive avec menu mobile
 * - Style qui change au scroll (transparence -> fond blanc)
 * - Bouton de prise de rendez-vous mis en évidence
 * - Accessibilité optimisée
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Détection du scroll pour changer le style du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation principale
  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/soins", label: "Nos Soins" },
    { href: "/a-propos", label: "À Propos" },
    { href: "/urgences", label: "Urgences" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-4"
          : "bg-white/95 backdrop-blur-sm py-6"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo et nom du cabinet */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
            aria-label="Retour à l'accueil"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
              DA
            </div>
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-lg text-secondary-900 leading-tight">
                Cabinet Dentaire
              </div>
              <div className="text-primary-600 font-semibold text-sm">
                Dr Abensour
              </div>
            </div>
          </Link>

          {/* Navigation desktop */}
          <ul className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-secondary-700 hover:text-primary-600 font-medium transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Bouton de rendez-vous */}
          <div className="hidden lg:block">
            <Link
              href="/contact#rendez-vous"
              className="btn-primary"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Prendre RDV
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6 text-secondary-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-secondary-200 animate-fade-in">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/contact#rendez-vous"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Prendre RDV
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
