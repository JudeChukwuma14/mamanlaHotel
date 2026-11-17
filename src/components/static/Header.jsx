import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X, User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../../assets/images/Mamanla.png";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
} from "../../redux/slices/authSlice";
import { logoutApi } from "../../api/endpoints";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Rooms", to: "/rooms" },
    { label: "About", to: "/about" },
    { label: "Services", to: "/services" },
    { label: "Contact", to: "/contact" },
    ...(isAuthenticated ? [{ label: "My Bookings", to: "/my-bookings" }] : []),
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Proceed with client logout even if backend cookie clear encounters an issue
    } finally {
      dispatch(logout());
      toast.success("Signed out successfully");
      navigate("/");
      setIsOpen(false);
    }
  };

  const linkClass = ({ isActive }) =>
    `relative font-medium transition-colors duration-200 pb-1 text-sm ${
      isActive
        ? "text-[#0c6478] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0c6478]"
        : "text-[#15343b] hover:text-[#0c6478]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
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
            className="hidden md:flex items-center gap-7"
            aria-label="Primary navigation"
          >
            {navLinks.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA & Auth Controls */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <User size={14} className="text-[#0c6478]" />
                  {user?.userName || user?.email?.split("@")[0] || "Guest"}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out"
                  className="text-xs font-medium text-gray-500 hover:text-rose-600 flex items-center gap-1 transition"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="text-xs font-bold text-[#15343b] hover:text-[#0c6478] transition px-3 py-2"
              >
                Sign In
              </NavLink>
            )}

            <NavLink
              to="/booking"
              className="bg-[#0c6478] hover:bg-[#0a536a] text-white rounded-lg px-5 py-2 font-semibold transition-colors duration-200 text-sm shadow-sm"
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
          isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
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
                `block px-3 py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm ${
                  isActive
                    ? "bg-[#0c6478]/10 text-[#0c6478] font-semibold"
                    : "text-[#15343b] hover:bg-gray-50 hover:text-[#0c6478]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-gray-100 mt-1 space-y-2">
              <div className="px-3 text-xs text-gray-500">
                Signed in as{" "}
                <span className="font-semibold text-gray-800">
                  {user?.userName || user?.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg font-medium flex items-center gap-2 transition"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              Sign In
            </NavLink>
          )}

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
