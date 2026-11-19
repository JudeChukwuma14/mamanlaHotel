import React from "react";
import {
  BedDouble,
  CalendarCheck,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../../assets/images/Mamanla.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import { useAuthActions } from "../../hooks/useAuthAction";

const navSections = [
  {
    title: "OVERVIEW",
    links: [
      {
        label: "Dashboard",
        to: "/admin/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        label: "Bookings",
        to: "/admin/bookings",
        icon: CalendarCheck,
        badge: null,
      },
      {
        label: "Rooms",
        to: "/admin/rooms",
        icon: BedDouble,
        badge: null,
      },
    ],
  },
];

const AdminSiderbar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const {handleLogout} = useAuthActions()

  const displayName = user?.userName || "Administrator";
  const initials = displayName.charAt(0).toUpperCase();

  const isLinkActive = (to) => {
    if (to === "/admin/dashboard" || to === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/admin" ||
        location.pathname === "/admin/dashboard"
      );
    }
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-[#0bd0c7]/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#112a30] text-gray-200 flex flex-col border-r border-[#1a3d46] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-18 px-5 flex items-center justify-between border-b border-[#1a3d46] bg-[#112a31]">
          <NavLink to="/admin/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#0bd0c7]/50 transition-colors">
              <img
                src={Logo}
                alt="Mamanla"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex">
              <span className="font-bold text-white">Mamanla Hotel</span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 no-scrollbar">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.links.map(({ label, to, icon: Icon, badge }) => {
                  const active = isLinkActive(to);
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={onClose}
                      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                        active
                          ? "bg-[#0c6478] text-white shadow-md shadow-[#0c6478]/30 font-semibold"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <Icon
                            size={19}
                            className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                              active
                                ? "text-[#0bd0c7]"
                                : "text-gray-400 group-hover:text-white"
                            }`}
                          />
                        )}

                        <span>{label}</span>
                      </div>
                      {badge ? (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-[#0bd0c7]/20 text-[#0bd0c7]"
                          }`}
                        >
                          {badge}
                        </span>
                      ) : (
                        active && (
                          <ChevronRight
                            size={16}
                            className="text-white/60 shrink-0"
                          />
                        )
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-2">
            <p className="px-3 text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-2">
              PUBLIC SITE
            </p>
            <NavLink
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <ExternalLink
                  size={18}
                  className="text-gray-400 group-hover:text-[#0bd0c7] transition-colors"
                />
                <span>View Live Hotel</span>
              </div>
              <span className="text-[11px] text-gray-400 group-hover:text-gray-200">
                ↗
              </span>
            </NavLink>
          </div>
        </div>

        <div className="p-4 border-t border-[#1a3d46] bg-[#0d2227]/90">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#0c6478] to-[#0bd0c7] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-white truncate">
                {displayName}
              </span>
              <span className="text-sm font-semibold text-white truncate">
                {user?.email}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/15 rounded-xl transition-colors cursor-pointer border border-red-500/20">
          <LogOut/>
          <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSiderbar;
