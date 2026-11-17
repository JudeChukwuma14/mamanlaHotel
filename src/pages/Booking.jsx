import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Calendar,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  Loader2,
  BedDouble,
  Users,
  MessageSquare,
  Receipt,
  Clock,
} from "lucide-react";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { PREVIEW_ROOMS, fetchFeaturedRoomsApi } from "../api/roomService";

const getTodayStr = () => new Date().toISOString().split("T")[0];
const getFutureDateStr = (days = 3) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  // Available rooms initialized from Home.jsx PREVIEW_ROOMS, updated dynamically via backend
  const passedRoom = location.state?.selectedRoom || null;
  const initialRooms = passedRoom
    ? [passedRoom, ...PREVIEW_ROOMS.filter((r) => (r._id || r.id || r.slug) !== (passedRoom._id || passedRoom.id || passedRoom.slug))]
    : PREVIEW_ROOMS;

  const [rooms, setRooms] = useState(initialRooms);

  const initialRoomId =
    passedRoom?._id || passedRoom?.id || passedRoom?.slug || initialRooms[0]?._id || initialRooms[0]?.slug || "";

  const [formData, setFormData] = useState({
    roomId: initialRoomId,
    numRooms: "1",
    checkIn: getTodayStr(),
    checkOut: getFutureDateStr(3),
    adults: "2",
    children: "0",
    fullName: currentUser?.userName || currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    specialRequests: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch live rooms from Home.jsx shared endpoint to ensure prices and rooms stay synchronized
  useEffect(() => {
    let isMounted = true;
    fetchFeaturedRoomsApi()
      .then((fetchedRooms) => {
        if (isMounted && Array.isArray(fetchedRooms) && fetchedRooms.length > 0) {
          if (passedRoom) {
            const passedId = passedRoom._id || passedRoom.id || passedRoom.slug;
            const filtered = fetchedRooms.filter(
              (r) => (r._id || r.id || r.slug) !== passedId
            );
            setRooms([passedRoom, ...filtered]);
          } else {
            setRooms(fetchedRooms);
          }
        }
      })
      .catch(() => {
        // Keeps fallback preview rooms if offline
      });

    return () => {
      isMounted = false;
    };
  }, [passedRoom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Find the selected room from available rooms list - no hardcoded prices!
  const selectedRoom =
    rooms.find((r) => (r._id || r.id || r.slug) === formData.roomId) ||
    rooms[0] ||
    null;

  const pricePerNight = selectedRoom
    ? Number(selectedRoom.pricePerNight ?? selectedRoom.price ?? 0)
    : 0;

  const nights = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [formData.checkIn, formData.checkOut]);

  const roomCount = parseInt(formData.numRooms, 10) || 1;
  const totalAmount = pricePerNight * nights * roomCount;

  const formatDateRange = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return `${nights} Night${nights > 1 ? "s" : ""}`;
    }
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const options = { month: "short", day: "numeric" };
    const startStr = isNaN(start.getTime())
      ? formData.checkIn
      : start.toLocaleDateString("en-US", options);
    const endStr = isNaN(end.getTime())
      ? formData.checkOut
      : end.toLocaleDateString("en-US", options);
    return `${nights} Night${nights > 1 ? "s" : ""} (${startStr} – ${endStr})`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please provide a contact phone number.");
      return;
    }
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(
        `Reservation confirmed for ${selectedRoom?.name || "your suite"}! Confirmation details sent to ${formData.email}.`
      );
      navigate("/");
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#15343b]">
          Reservation Form
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select your suite and complete the details below to reserve your stay.
        </p>
      </div>

      {/* Form (Flat design with clean borders, no shadows) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-8"
      >
        {/* SECTION 1: Stay Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#0c6478] text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-[#0c6478]" />
              <h2 className="text-base sm:text-lg font-semibold text-[#15343b]">
                Stay Details
              </h2>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Room Type (Populated dynamically from Home.jsx rooms) */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="roomId"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Available Suites &amp; Rooms
              </label>
              <div className="relative">
                <select
                  id="roomId"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#15343b] appearance-none cursor-pointer pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition"
                >
                  {rooms.map((room) => {
                    const id = room._id || room.id || room.slug;
                    const price = room.pricePerNight ?? room.price ?? 0;
                    return (
                      <option key={id} value={id}>
                        {room.name} — ₦{Number(price).toLocaleString()} / night
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Number of Rooms */}
            <div className="space-y-1.5">
              <label
                htmlFor="numRooms"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Number of Rooms
              </label>
              <div className="relative">
                <select
                  id="numRooms"
                  name="numRooms"
                  value={formData.numRooms}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#15343b] appearance-none cursor-pointer pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition"
                >
                  <option value="1">1 Suite / Room</option>
                  <option value="2">2 Suites / Rooms</option>
                  <option value="3">3 Suites / Rooms</option>
                  <option value="4">4+ Private Suites</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Check-in Date */}
            <div className="space-y-1.5">
              <label
                htmlFor="checkIn"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Check-in Date
              </label>
              <div className="relative">
                <input
                  id="checkIn"
                  type="date"
                  name="checkIn"
                  min={getTodayStr()}
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#15343b] font-medium focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition pr-10"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Check-out Date */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="checkOut"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Check-out Date
              </label>
              <div className="relative">
                <input
                  id="checkOut"
                  type="date"
                  name="checkOut"
                  min={formData.checkIn || getTodayStr()}
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#15343b] font-medium focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition pr-10"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Guest Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#0c6478] text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0c6478]" />
              <h2 className="text-base sm:text-lg font-semibold text-[#15343b]">
                Guest Details
              </h2>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adults */}
            <div className="space-y-1.5">
              <label
                htmlFor="adults"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Number of Adults
              </label>
              <div className="relative">
                <select
                  id="adults"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#15343b] appearance-none cursor-pointer pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4+">4+ Adults</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Children */}
            <div className="space-y-1.5">
              <label
                htmlFor="children"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Number of Children
              </label>
              <div className="relative">
                <select
                  id="children"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#15343b] appearance-none cursor-pointer pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition"
                >
                  <option value="0">0 Children</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Children</option>
                  <option value="3+">3+ Children</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Full Name */}
            <div className="md:col-span-2 space-y-1.5">
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#15343b] font-medium focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition placeholder-gray-400"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#15343b] font-medium focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition placeholder-gray-400"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +234 800 000 0000"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-[#15343b] font-medium focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Special Requests */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#0c6478] text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0c6478]" />
              <h2 className="text-base sm:text-lg font-semibold text-[#15343b]">
                Special Requests
              </h2>
            </div>
            <span className="text-xs text-gray-400 italic">(Optional)</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <textarea
            id="specialRequests"
            name="specialRequests"
            rows={3}
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Write any special requests here… (e.g. airport pickup, high floor, dietary requirements)"
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-[#0c6478] transition placeholder-gray-400 resize-none"
          />
        </div>

        {/* SECTION 4: Booking Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#0c6478]" />
              <h3 className="text-sm sm:text-base font-semibold text-[#15343b]">
                Booking Summary
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Guaranteed Best Rate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 text-xs sm:text-sm">
                Selected Room:
              </span>
              <span className="font-semibold text-[#15343b] text-xs sm:text-sm text-right">
                {selectedRoom?.name || "Room"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 text-xs sm:text-sm">
                Price Per Night:
              </span>
              <span className="font-semibold text-[#15343b] text-xs sm:text-sm">
                ₦{pricePerNight.toLocaleString()} / night
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 text-xs sm:text-sm">
                Duration:
              </span>
              <span className="font-semibold text-[#15343b] text-xs sm:text-sm">
                {formatDateRange()}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 text-xs sm:text-sm">
                Rooms &amp; Guests:
              </span>
              <span className="font-semibold text-[#15343b] text-xs sm:text-sm">
                {roomCount} {roomCount > 1 ? "Rooms" : "Room"} ({formData.adults} Adults
                {formData.children !== "0" ? `, ${formData.children} Children` : ""})
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Total Amount
              </div>
              <div className="text-xs text-gray-400">
                ₦{pricePerNight.toLocaleString()} × {nights} {nights > 1 ? "nights" : "night"}{roomCount > 1 ? ` × ${roomCount} rooms` : ""}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#0c6478]">
              ₦{totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Submit Action (Clean button, no shadow) */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#0c6478] hover:bg-[#0a536a] text-white text-sm sm:text-base font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Reservation…</span>
              </>
            ) : (
              <>
                <span>Confirm Reservation</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0c6478]" />
              256-Bit SSL Encrypted
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0c6478]" />
              Complimentary cancellation up to 48h prior
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
