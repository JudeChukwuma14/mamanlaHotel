import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/images/Mamanla.png"
const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative font-medium transition-colors duration-200 pb-1 ${
      isActive
        ? "text-[#0c6478] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0c6478]"
        : "text-[#15343b] hover:text-[#0c6478]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        
          <NavLink
            to="/"
            className="flex items-center shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <img
              src={Logo}
              alt="Mama La Hotel Logo"
              className="h-10 w-auto object-contain"
            />
          </NavLink>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
          >
            {navLinks.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <NavLink
              to="/booking"
              className="bg-[#0c6478] hover:bg-[#0a536a] text-white rounded-lg px-6 py-2.5 font-semibold transition-colors duration-200 text-sm"
            >
              Book Now
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-[#15343b] hover:text-[#0c6478] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7]"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white border-t border-gray-100`}
      >
        <nav
          className="flex flex-col px-4 py-3 gap-1"
          aria-label="Mobile navigation"
        >
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#0c6478]/10 text-[#0c6478]"
                    : "text-[#15343b] hover:bg-gray-50 hover:text-[#0c6478]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/booking"
            onClick={() => setIsOpen(false)}
            className="mt-2 block text-center bg-[#0c6478] hover:bg-[#0a536a] text-white rounded-lg px-6 py-2.5 font-semibold transition-colors duration-200 text-sm"
          >
            Book Now
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
