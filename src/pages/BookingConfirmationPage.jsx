import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  CheckCircle2,
  Copy,
  Clock,
  Calendar,
  Users,
  BedDouble,
  Printer,
  ChevronRight,
  AlertCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchBookingByReference,
  selectCurrentBooking,
  selectBookingLoading,
} from "../redux/slices/bookingSlice";
import CancelBookingModal from "../components/CancelBookingModal";

const BookingConfirmationPage = () => {
  const { bookingReference } = useParams();
  const dispatch = useDispatch();

  const booking = useSelector(selectCurrentBooking);
  const loading = useSelector(selectBookingLoading);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (bookingReference) {
      dispatch(fetchBookingByReference(bookingReference));
    }
  }, [bookingReference, dispatch]);

  // Countdown timer if booking expiresAt exists and status is pending
  useEffect(() => {
    if (!booking?.expiresAt || booking?.status !== "pending") {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(booking.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking?.expiresAt, booking?.status]);

  const handleCopyReference = () => {
    if (bookingReference) {
      navigator.clipboard.writeText(bookingReference);
      toast.success("Booking reference copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f5fbfb]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0bd0c7] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Retrieving reservation details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f5fbfb] px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">
            We couldn't locate reservation <span className="font-mono font-semibold">{bookingReference}</span>.
          </p>
          <Link
            to="/booking"
            className="inline-block bg-[#0c6478] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a536a] transition"
          >
            Make a New Reservation
          </Link>
        </div>
      </div>
    );
  }

  const statusStyles = {
    pending: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      badge: "bg-amber-100 text-amber-800",
      icon: Clock,
      title: "Reservation Pending Confirmation",
    },
    confirmed: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      badge: "bg-emerald-100 text-emerald-800",
      icon: CheckCircle2,
      title: "Reservation Confirmed!",
    },
    cancelled: {
      bg: "bg-rose-50 border-rose-200 text-rose-800",
      badge: "bg-rose-100 text-rose-800",
      icon: XCircle,
      title: "Reservation Cancelled",
    },
    completed: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      badge: "bg-blue-100 text-blue-800",
      icon: CheckCircle2,
      title: "Stay Completed",
    },
  };

  const statusInfo = statusStyles[booking.status] || statusStyles.pending;
  const StatusIcon = statusInfo.icon;

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "EEE, dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#f5fbfb] min-h-screen py-10 lg:py-16 text-gray-900 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb (hidden on print) */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <Link to="/" className="hover:text-[#0c6478]">Home</Link>
            <span>/</span>
            <Link to="/my-bookings" className="hover:text-[#0c6478]">My Bookings</Link>
            <span>/</span>
            <span className="text-[#0c6478] font-mono">{bookingReference}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Printer size={14} /> Print Receipt
            </button>
            <Link
              to="/my-bookings"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0c6478] text-white text-xs font-medium hover:bg-[#0a536a] transition"
            >
              My Bookings <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`rounded-2xl border p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${statusInfo.bg}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white shadow-sm shrink-0">
              <StatusIcon size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{statusInfo.title}</h2>
              <p className="text-xs opacity-90 mt-0.5">
                A confirmation has been logged for guest {booking.guestDetails?.fullName || "Guest"}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {timeLeft && (
              <div className="text-right">
                <span className="text-[11px] block text-amber-700 font-medium">Expires In</span>
                <span className="font-mono text-sm font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                  {timeLeft}
                </span>
              </div>
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusInfo.badge}`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        {/* Booking Card Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Top Reference Bar */}
          <div className="bg-[#15343b] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#0bd0c7] font-semibold">
                Booking Reference
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider">
                  {booking.bookingReference}
                </span>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  title="Copy reference code"
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition print:hidden"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="sm:text-right text-xs text-white/70">
              <p>Booked on</p>
              <p className="font-semibold text-white mt-0.5">
                {formatDateStr(booking.createdAt)}
              </p>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Room Type & Hotel Info */}
            <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#0c6478]">
                  {booking.roomType?.category || "Luxury Accommodations"}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {booking.roomType?.name || "Mama La Suite"}
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={13} className="text-[#0bd0c7]" />
                  Mama La Hotel & Co. — Main Luxury Wing
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-gray-400">Total Price</span>
                <p className="text-2xl font-extrabold text-[#0c6478]">
                  ₦{Number(booking.pricing?.totalAmount || 0).toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-500">
                  ₦{Number(booking.pricing?.pricePerNight || 0).toLocaleString()} / night
                </p>
              </div>
            </div>

            {/* Check-In / Check-Out Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 rounded-2xl bg-[#f5fbfb] border border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Calendar size={13} /> Check-In
                </span>
                <p className="font-bold text-gray-900">{formatDateStr(booking.checkInDate)}</p>
                <p className="text-xs text-gray-500 mt-0.5">After 2:00 PM</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Calendar size={13} /> Check-Out
                </span>
                <p className="font-bold text-gray-900">{formatDateStr(booking.checkOutDate)}</p>
                <p className="text-xs text-gray-500 mt-0.5">Before 11:00 AM</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <BedDouble size={13} /> Rooms & Duration
                </span>
                <p className="font-bold text-gray-900">
                  {booking.numberOfRooms} Room{booking.numberOfRooms > 1 ? "s" : ""} • {booking.numberOfNights} Night{booking.numberOfNights > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <Users size={12} /> {booking.guests?.adults || 1} Adults, {booking.guests?.children || 0} Children
                </p>
              </div>
            </div>

            {/* Guest Details & Billing Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-gray-100 pb-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Guest Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="font-bold text-gray-900">{booking.guestDetails?.fullName}</p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    {booking.guestDetails?.email}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    {booking.guestDetails?.phone}
                  </p>
                  {booking.specialRequests && (
                    <div className="mt-3 p-3 rounded-xl bg-gray-50 text-xs text-gray-600 border border-gray-100">
                      <span className="font-semibold block text-gray-700 mb-0.5">Special Requests:</span>
                      {booking.specialRequests}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Billing Breakdown
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      ₦{Number(booking.pricing?.pricePerNight || 0).toLocaleString()} × {booking.numberOfNights} nights × {booking.numberOfRooms} room(s)
                    </span>
                    <span className="font-medium text-gray-900">
                      ₦{Number(booking.pricing?.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>VAT & Hospitality Taxes</span>
                    <span className="text-emerald-700 font-medium">Included</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-base text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-[#0c6478]">
                      ₦{Number(booking.pricing?.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer (hidden on print) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 print:hidden">
              <Link
                to="/rooms"
                className="text-xs font-semibold text-[#0c6478] hover:underline"
              >
                ← Return to Rooms Catalog
              </Link>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <button
                    type="button"
                    onClick={() => setIsCancelOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
                  >
                    Cancel Reservation
                  </button>
                )}

                <Link
                  to="/my-bookings"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#0c6478] hover:bg-[#0a536a] text-white text-xs font-bold shadow-sm transition text-center"
                >
                  Manage All Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        bookingReference={booking.bookingReference}
      />
    </div>
  );
};

export default BookingConfirmationPage;
