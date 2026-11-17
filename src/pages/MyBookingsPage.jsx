import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  Calendar,
  BedDouble,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchMyBookings,
  selectMyBookings,
  selectBookingPagination,
  selectBookingLoading,
} from "../redux/slices/bookingSlice";
import CancelBookingModal from "../components/CancelBookingModal";

const TABS = [
  { label: "All Reservations", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const MyBookingsPage = () => {
  const dispatch = useDispatch();

  const bookings = useSelector(selectMyBookings);
  const pagination = useSelector(selectBookingPagination);
  const loading = useSelector(selectBookingLoading);

  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
    };
    if (activeTab) params.status = activeTab;

    dispatch(fetchMyBookings(params));
  }, [dispatch, activeTab, currentPage]);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    setCurrentPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={12} /> Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock size={12} /> Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle size={12} /> Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#f5fbfb] min-h-screen py-10 lg:py-16 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#15343b] tracking-tight">
              My Reservations
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View, track, and manage all your past and upcoming hotel stays.
            </p>
          </div>

          <Link
            to="/booking"
            className="inline-flex items-center justify-center gap-2 bg-[#0bd0c7] hover:bg-[#0ab8b0] text-[#15343b] font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm self-start sm:self-auto"
          >
            <BedDouble size={16} /> Book Another Stay
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 mb-6 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === tab.value
                  ? "bg-[#15343b] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-[#0c6478] flex items-center justify-center mx-auto mb-4">
              <FileText size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No Reservations Found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {activeTab
                ? `You don't have any bookings with status "${activeTab}".`
                : "You haven't made any reservations yet. Ready for an unforgettable experience?"}
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 bg-[#0c6478] hover:bg-[#0a536a] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
            >
              Explore Our Rooms <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id || b.id || b.bookingReference}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:border-gray-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#15343b] bg-gray-100 px-2.5 py-0.5 rounded-md">
                      {b.bookingReference}
                    </span>
                    {getStatusBadge(b.status)}
                    <span className="text-xs text-gray-400">
                      Booked {formatDate(b.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {b.roomType?.name || "Luxury Accommodations"}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar size={13} className="text-[#0bd0c7]" />
                      {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                    </span>
                    <span>•</span>
                    <span>
                      {b.numberOfRooms} Room{b.numberOfRooms > 1 ? "s" : ""}
                    </span>
                    <span>•</span>
                    <span>
                      {b.numberOfNights} Night{b.numberOfNights > 1 ? "s" : ""}
                    </span>
                    <span>•</span>
                    <span>
                      {b.guests?.adults || 1} Adult{b.guests?.adults > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Right Price & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  <div className="text-left lg:text-right">
                    <p className="text-xs text-gray-400">Total Price</p>
                    <p className="text-xl font-extrabold text-[#0c6478]">
                      ₦{Number(b.pricing?.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status !== "cancelled" && b.status !== "completed" && (
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForCancel(b.bookingReference)}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                    )}

                    <Link
                      to={`/booking/confirmation/${b.bookingReference}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#15343b] hover:bg-[#0c6478] text-white text-xs font-bold transition shadow-sm"
                    >
                      Details <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <span className="text-xs font-medium text-gray-500">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} total)
                </span>

                <button
                  type="button"
                  disabled={currentPage >= pagination.totalPages || loading}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, pagination.totalPages))}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={Boolean(selectedBookingForCancel)}
        onClose={() => setSelectedBookingForCancel(null)}
        bookingReference={selectedBookingForCancel}
        onCancelled={() => {
          // Re-fetch current list on cancellation
          const params = { page: currentPage, limit: 10 };
          if (activeTab) params.status = activeTab;
          dispatch(fetchMyBookings(params));
        }}
      />
    </div>
  );
};

export default MyBookingsPage;
