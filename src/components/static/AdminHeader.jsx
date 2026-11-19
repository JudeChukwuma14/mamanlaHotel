import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  ChevronDown,
  Settings,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import { useAuthActions } from "../../hooks/useAuthAction";

const routeTitles = {
  "/admin/dashboard": "Overview Dashboard",
  "/admin/bookings": "Reservations & Bookings",
  "/admin/rooms": "Room Management",
  "/admin/guests": "Guest Profiles",
  "/admin/payments": "Payments & Transactions",
  "/admin/services": "Hotel Services & Amenities",
  "/admin/settings": "Portal Settings",
};

export default function AdminHeader({ onOpenSidebar }) {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const { handleLogout } = useAuthActions();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle = routeTitles[location.pathname] || "Admin Console";

  const displayName =
    user?.userName ||
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Administrator";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dummyNotifications = [
    {
      id: 1,
      title: "New Booking Received",
      desc: "Deluxe Ocean Suite booked by Sarah Connor for 3 nights.",
      time: "5m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment Confirmed",
      desc: "₦185,000 received for reservation #ML-8842.",
      time: "42m ago",
      unread: true,
    },
    {
      id: 3,
      title: "Room Checked Out",
      desc: "Room 304 marked clean and ready for check-in.",
      time: "2h ago",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-xs px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-[#0c6478] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] cursor-pointer transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex flex-col">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#15343b] tracking-tight">
              {pageTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Actions, Search, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Search - hidden on mobile, visible on desktop */}
        <div className="hidden md:flex items-center relative w-56 lg:w-72">
          <Search
            size={16}
            className="absolute left-3 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search bookings, rooms, guests…"
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] text-[#15343b] transition"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-gray-500 hover:text-[#0c6478] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#0bd0c7] border-2 border-white rounded-full animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-[#15343b]">
                  Notifications
                </span>
                <span className="text-[11px] font-semibold text-[#0c6478] bg-[#0c6478]/10 px-2 py-0.5 rounded-full">
                  2 unread
                </span>
              </div>

              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {dummyNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-gray-50 transition-colors flex gap-3 ${
                      n.unread ? "bg-[#0bd0c7]/5" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#0c6478]/10 text-[#0c6478] flex items-center justify-center">
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#15343b] truncate">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-2 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-semibold text-[#0c6478] hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            type="button"
            onClick={() => setUserDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
            aria-expanded={userDropdownOpen}
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#0c6478] to-[#0bd0c7] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#15343b] leading-tight max-w-30 truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-[#0c6478] font-semibold leading-tight text-capitalize">
                {user.role}
              </span>
            </div>
            <ChevronDown
              size={15}
              className={`hidden sm:block text-gray-400 transition-transform duration-200 ${
                userDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-[#15343b] truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {user?.email || "admin@mamala.com"}
                </p>
                <div className="mt-1.5 inline-block text-[10px] uppercase font-bold text-[#0c6478] bg-[#0c6478]/10 px-2 py-0.5 rounded-md">
                  Administrator
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-[#0c6478] transition-colors"
                >
                  <ExternalLink size={15} className="text-gray-400" />
                  <span>Public Hotel Site</span>
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-[#0c6478] transition-colors"
                >
                  <Settings size={15} className="text-gray-400" />
                  <span>Admin Settings</span>
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
