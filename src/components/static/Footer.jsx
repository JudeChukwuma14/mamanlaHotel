import React from "react";
import { Link } from "react-router-dom";  
import Logo from "../../assets/images/Mamanla.png"

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
  { label: "Book Now", to: "/booking" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0c6478] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1: Logo + description */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-block">
              <img
                src={Logo}
                alt="Mama La Hotel Logo"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Mama La Hotel and Co. offers an unmatched luxury hospitality
              experience in the heart of Lagos, Nigeria. From elegant rooms to
              world-class dining, we redefine comfort and style.
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0bd0c7]">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/80 hover:text-[#0bd0c7] transition-colors duration-200 text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0bd0c7]">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📧</span>
                <a
                  href="mailto:info@mamanlahotel.com"
                  className="hover:text-[#0bd0c7] transition-colors duration-200 break-all"
                >
                  info@mamanlahotel.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📞</span>
                <a
                  href="tel:+2340000000000"
                  className="hover:text-[#0bd0c7] transition-colors duration-200"
                >
                  +234 000 000 0000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">🕐</span>
                <span>Mon – Sun: 24 / 7</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-white/60">
            &copy; {currentYear} Mama La Hotel and Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
