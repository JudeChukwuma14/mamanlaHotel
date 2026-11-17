import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { cancelBooking, selectBookingLoading } from "../redux/slices/bookingSlice";

const CANCELLATION_REASONS = [
  "Change in travel schedule",
  "Found alternative accommodation",
  "Personal or family emergency",
  "Booking made by mistake",
  "Flight / travel delay",
  "Other",
];

const CancelBookingModal = ({ isOpen, onClose, bookingReference, onCancelled }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectBookingLoading);

  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  if (!isOpen) return null;

  const handleConfirmCancel = async () => {
    if (!bookingReference) {
      toast.error("Invalid booking reference");
      return;
    }

    const finalReason =
      selectedReason === "Other" && customReason.trim()
        ? customReason.trim()
        : selectedReason;

    const result = await dispatch(
      cancelBooking({ bookingReference, reason: finalReason })
    );

    if (cancelBooking.fulfilled.match(result)) {
      toast.success("Reservation has been successfully cancelled.");
      if (onCancelled) onCancelled(result.payload);
      onClose();
    } else {
      toast.error(
        result.payload?.message || "Failed to cancel reservation. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 pb-4 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Cancel Reservation</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Reference: <span className="font-mono font-semibold text-gray-700">{bookingReference}</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-2 space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to cancel this reservation? This action cannot be reversed.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Reason for Cancellation
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent"
            >
              {CANCELLATION_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {selectedReason === "Other" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Please specify
              </label>
              <textarea
                rows={3}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Tell us more about your cancellation..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 bg-gray-50 flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors"
          >
            Keep Reservation
          </button>
          <button
            type="button"
            onClick={handleConfirmCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling…
              </>
            ) : (
              "Confirm Cancellation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
