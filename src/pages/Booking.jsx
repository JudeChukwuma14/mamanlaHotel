import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { differenceInDays, format, addDays } from "date-fns";
import {
  Calendar,
  Users,
  BedDouble,
  Phone,
  Mail,
  User,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createBooking,
  selectBookingLoading,
  resetCreateSuccess,
  selectCreateSuccess,
  selectCurrentBooking,
} from "../redux/slices/bookingSlice";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { fetchRoomsApi } from "../api/endpoints";

const today = format(new Date(), "yyyy-MM-dd");
const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

const Booking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectBookingLoading);
  const createSuccess = useSelector(selectCreateSuccess);
  const currentBooking = useSelector(selectCurrentBooking);

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(
    location.state?.room?._id || location.state?.room?.id || ""
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.userName || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      checkInDate: today,
      checkOutDate: tomorrow,
      numberOfRooms: 1,
      adults: 1,
      children: 0,
      specialRequests: "",
    },
  });

  // Fetch available rooms for selection
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await fetchRoomsApi();
        const data = res.data;
        const list = Array.isArray(data?.rooms)
          ? data.rooms
          : Array.isArray(data)
          ? data
          : [];
        setRooms(list);

        // Pre-select first room if none selected yet
        if (!selectedRoomId && list.length > 0) {
          const first = list[0]._id || list[0].id;
          setSelectedRoomId(first);
        }
      } catch {
        toast.error("Could not load rooms list. Please refresh.");
      } finally {
        setRoomsLoading(false);
      }
    };

    loadRooms();
  }, [selectedRoomId]);

  // Keep form fields synced if user info becomes available
  useEffect(() => {
    if (user) {
      if (user.userName) setValue("fullName", user.userName);
      if (user.email) setValue("email", user.email);
      if (user.phoneNumber) setValue("phone", user.phoneNumber);
    }
  }, [user, setValue]);

  // Navigate to confirmation page once booking succeeds
  useEffect(() => {
    if (createSuccess && currentBooking?.bookingReference) {
      const ref = currentBooking.bookingReference;
      dispatch(resetCreateSuccess());
      navigate(`/booking/confirmation/${ref}`);
    }
  }, [createSuccess, currentBooking, dispatch, navigate]);

  const selectedRoom = rooms.find(
    (r) => (r._id || r.id) === selectedRoomId
  ) || location.state?.room || null;

  const checkIn = watch("checkInDate");
  const checkOut = watch("checkOutDate");
  const numberOfRooms = Number(watch("numberOfRooms")) || 1;

  const nights =
    checkIn && checkOut
      ? Math.max(differenceInDays(new Date(checkOut), new Date(checkIn)), 0)
      : 0;

  const pricePerNight = Number(
    selectedRoom?.pricePerNight ?? selectedRoom?.price ?? 0
  );
  const estimatedSubtotal = pricePerNight * nights * numberOfRooms;
  const estimatedTaxes = Math.round(estimatedSubtotal * 0.075); // 7.5% VAT estimate
  const estimatedTotal = estimatedSubtotal + estimatedTaxes;

  const onSubmit = async (data) => {
    if (!selectedRoomId && !selectedRoom) {
      toast.error("Please select a room to reserve.");
      return;
    }

    if (nights <= 0) {
      toast.error("Check-out date must be at least 1 day after check-in.");
      return;
    }

    const payload = {
      roomTypeId: selectedRoomId || selectedRoom?._id || selectedRoom?.id,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      numberOfRooms: Number(data.numberOfRooms),
      adults: Number(data.adults),
      children: Number(data.children),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      specialRequests: data.specialRequests || "",
    };

    const result = await dispatch(createBooking(payload));

    if (createBooking.rejected.match(result)) {
      const errCode = result.payload?.code;
      if (
        errCode === "INSUFFICIENT_AVAILABILITY" ||
        result.payload?.status === 409
      ) {
        toast.error(
          "This room has just been reserved for those dates. Please try another room or date."
        );
      } else {
        toast.error(result.payload?.message || "Failed to complete reservation.");
      }
    }
  };

  const getRoomImage = (r) => {
    if (!r) return "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";
    if (Array.isArray(r.images) && r.images.length > 0) {
      const first = r.images[0];
      if (typeof first === "string" && first.trim()) return first;
      if (first?.url) return first.url;
    }
    if (typeof r.image === "string" && r.image.trim()) return r.image;
    if (typeof r.imageUrl === "string" && r.imageUrl.trim()) return r.imageUrl;
    return "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";
  };

  return (
    <div className="bg-[#f5fbfb] min-h-screen py-10 lg:py-16 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            <Link to="/" className="hover:text-[#0c6478]">Home</Link>
            <span>/</span>
            <Link to="/rooms" className="hover:text-[#0c6478]">Rooms</Link>
            <span>/</span>
            <span className="text-[#0c6478]">Reservation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15343b] tracking-tight">
            Reserve Your Luxury Stay
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-2xl">
            Complete your booking details below. You will receive an instant confirmation
            and booking reference upon submission.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Room Selector + Form Fields */}
            <div className="lg:col-span-8 space-y-6">

              {/* 1. Room Selection */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#15343b] flex items-center gap-2">
                    <BedDouble className="text-[#0bd0c7]" size={20} />
                    1. Select Room Type
                  </h2>
                  <Link
                    to="/rooms"
                    className="text-xs font-semibold text-[#0c6478] hover:underline flex items-center gap-1"
                  >
                    View all rooms <ArrowRight size={13} />
                  </Link>
                </div>

                {roomsLoading ? (
                  <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
                ) : (
                  <div>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent mb-4"
                    >
                      {rooms.map((room) => {
                        const id = room._id || room.id;
                        const price = Number(room.pricePerNight ?? room.price ?? 0);
                        return (
                          <option key={id} value={id}>
                            {room.name} — ₦{price.toLocaleString()} / night ({room.category || "Standard"})
                          </option>
                        );
                      })}
                    </select>

                    {/* Room Preview Card */}
                    {selectedRoom && (
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <img
                          src={getRoomImage(selectedRoom)}
                          alt={selectedRoom.name}
                          className="w-full sm:w-36 h-24 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 w-full">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0c6478] bg-[#0c6478]/10 px-2 py-0.5 rounded-full">
                                {selectedRoom.category || "Luxury Suite"}
                              </span>
                              <h3 className="font-bold text-gray-900 mt-1">{selectedRoom.name}</h3>
                            </div>
                            <div className="text-right">
                              <p className="text-base font-extrabold text-[#15343b]">
                                ₦{pricePerNight.toLocaleString()}
                              </p>
                              <p className="text-[11px] text-gray-400">per night</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {selectedRoom.description || "Fully furnished with modern hospitality amenities."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Stay Dates & Guest Counts */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#15343b] flex items-center gap-2 mb-6">
                  <Calendar className="text-[#0bd0c7]" size={20} />
                  2. Dates & Guests
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Check-In Date *
                    </label>
                    <input
                      type="date"
                      min={today}
                      {...register("checkInDate", { required: "Check-in date is required" })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent"
                    />
                    {errors.checkInDate && (
                      <p className="text-xs text-red-500 mt-1">{errors.checkInDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Check-Out Date *
                    </label>
                    <input
                      type="date"
                      min={checkIn || today}
                      {...register("checkOutDate", { required: "Check-out date is required" })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent"
                    />
                    {errors.checkOutDate && (
                      <p className="text-xs text-red-500 mt-1">{errors.checkOutDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Number of Rooms
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      {...register("numberOfRooms", { required: true, min: 1, max: 10 })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Users size={13} /> Adults
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={selectedRoom?.maximumAdults ? selectedRoom.maximumAdults * numberOfRooms : 20}
                      {...register("adults", { required: true, min: 1 })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Children (0-12 yrs)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      {...register("children", { min: 0 })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Guest Contact Information */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#15343b] flex items-center gap-2 mb-6">
                  <User className="text-[#0bd0c7]" size={20} />
                  3. Guest Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. Jane Doe"
                        {...register("fullName", { required: "Full name is required" })}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder="jane@example.com"
                          {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                          })}
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="+234 801 234 5678"
                          {...register("phone", { required: "Phone number is required" })}
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <MessageSquare size={14} /> Special Requests <span className="text-gray-400 font-normal lowercase">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Quiet room away from elevator, feather-free pillows, late check-in."
                      {...register("specialRequests")}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Stay Summary & Submit */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-100">
                <h3 className="text-base font-bold text-[#15343b] pb-4 border-b border-gray-100">
                  Reservation Summary
                </h3>

                <div className="py-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Stay Duration</span>
                    <span className="font-semibold text-gray-900">
                      {nights} {nights === 1 ? "Night" : "Nights"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span>Rooms</span>
                    <span className="font-semibold text-gray-900">
                      {numberOfRooms} {numberOfRooms === 1 ? "Room" : "Rooms"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span>Nightly Rate</span>
                    <span className="font-semibold text-gray-900">
                      ₦{pricePerNight.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ₦{estimatedSubtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      Est. VAT & Service (7.5%)
                    </span>
                    <span className="font-medium text-gray-600">
                      ₦{estimatedTaxes.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-bold text-[#15343b]">Estimated Total</span>
                      <p className="text-[11px] text-gray-400">Final price computed by backend</p>
                    </div>
                    <span className="text-2xl font-extrabold text-[#0c6478]">
                      ₦{estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-[#0bd0c7] hover:bg-[#0ab8b0] text-[#15343b] font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#15343b]/30 border-t-[#15343b] rounded-full animate-spin" />
                      Creating Reservation…
                    </>
                  ) : (
                    <>
                      <BedDouble size={18} /> Confirm & Reserve Now
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-400 text-center mt-3">
                  Free cancellation up to 48 hours before check-in.
                </p>
              </div>

              {/* Complimentary Perks */}
              <div className="bg-[#15343b] text-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-[#0bd0c7]" />
                  <h4 className="text-sm font-bold tracking-wide uppercase text-[#0bd0c7]">
                    Included With Your Stay
                  </h4>
                </div>
                <ul className="space-y-2.5 text-xs text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0bd0c7]" />
                    Complimentary gourmet breakfast buffet
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0bd0c7]" />
                    Ultra-fast fiber optic Wi-Fi throughout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0bd0c7]" />
                    24/7 dedicated concierge & room service
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#0bd0c7]" />
                    Secure complimentary valet parking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
