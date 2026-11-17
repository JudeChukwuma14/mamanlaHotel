import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BedDouble,
  Users,
  Maximize2,
  DoorOpen,
  ShieldCheck,
  CheckCircle2,
  Star,
  Sparkles,
  Clock,
  ArrowLeft,
  ArrowRight,
  Phone,
  Wifi,
  Coffee,
  Tv,
  Check,
} from "lucide-react";
import { fetchRoomBySlugApi, fetchRoomsApi } from "../api/endpoints";
import RoomCard from "./RoomCard";

const DEFAULT_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";

// Curated fallback rooms for demo/offline resilience
const FALLBACK_ROOMS = [
  {
    _id: "preview-1",
    name: "Deluxe Ocean Suite",
    category: "Deluxe Suite",
    description:
      "Crafted with hypoallergenic Egyptian cotton linens, ergonomic architecture, and acoustic soundproofing for deep, restorative sleep. Enjoy sweeping panoramic ocean views from your private sunset balcony.",
    pricePerNight: 120000,
    slug: "deluxe-ocean-suite",
    numberOfBeds: 1,
    bedType: "King Bed",
    maximumAdults: 2,
    maximumChildren: 1,
    roomSize: 48,
    totalRooms: 5,
    amenities: [
      "High-speed Wi-Fi",
      "Ocean View Balcony",
      "Air Conditioning",
      "Smart 4K Television",
      "En-suite Marble Jacuzzi",
      "Nespresso Coffee Station",
      "24/7 Room Service",
      "In-room Electronic Safe",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    _id: "preview-2",
    name: "Presidential Penthouse",
    category: "Penthouse",
    description:
      "The pinnacle of bespoke luxury at Mamanla Hotel. Boasting private panoramic elevator access, dedicated butler service, an outdoor rooftop jacuzzi, and an expansive lounge tailored for VIP entertaining.",
    pricePerNight: 280000,
    slug: "presidential-penthouse",
    numberOfBeds: 2,
    bedType: "California King",
    maximumAdults: 4,
    maximumChildren: 2,
    roomSize: 110,
    totalRooms: 2,
    amenities: [
      "Private Rooftop Jacuzzi",
      "Dedicated Butler Service",
      "High-speed Wi-Fi",
      "Complimentary Mini-Bar",
      "Walk-in Dressing Room",
      "Chef-prepared Breakfast",
      "VIP Airport Chauffeur",
      "Bang & Olufsen Sound System",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    _id: "preview-3",
    name: "Executive Garden Villa",
    category: "Garden Villa",
    description:
      "Tucked away in our lush tropical sanctuary, the Executive Garden Villa blends secluded intimacy with refined comfort. Features an outdoor rain shower, private plunge pool, and tranquil garden vistas.",
    pricePerNight: 175000,
    slug: "executive-garden-villa",
    numberOfBeds: 1,
    bedType: "King Bed",
    maximumAdults: 2,
    maximumChildren: 1,
    roomSize: 65,
    totalRooms: 4,
    amenities: [
      "Private Garden Patio",
      "Outdoor Rain Shower",
      "High-speed Wi-Fi",
      "Smart Climate Control",
      "Organic Luxury Toiletries",
      "Artisan Tea & Coffee Bar",
      "Daily Housekeeping",
      "Bespoke Pillow Menu",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    _id: "preview-4",
    name: "Superior Skyline Room",
    category: "Superior Room",
    description:
      "Modern architectural sophistication high above the city. Floor-to-ceiling soundproof windows bathe the suite in natural light while presenting breathtaking dusk skyline views.",
    pricePerNight: 95000,
    slug: "superior-skyline-room",
    numberOfBeds: 1,
    bedType: "Queen Bed",
    maximumAdults: 2,
    maximumChildren: 0,
    roomSize: 38,
    totalRooms: 8,
    amenities: [
      "High-speed Wi-Fi",
      "Panoramic Skyline View",
      "Air Conditioning",
      "Executive Work Desk",
      "Smart Flat-screen TV",
      "Complimentary Bottled Water",
      "Daily Housekeeping",
      "Electronic Safe",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      },
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];

const RoomDetails = () => {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImageIndex(0);

    const loadRoomAndSimilar = async () => {
      setLoading(true);
      setError(null);

      let currentRoomData = null;

      // 1. Fetch Current Room Details
      try {
        const response = await fetchRoomBySlugApi(slug);
        const data = response?.data;
        currentRoomData = data?.room || (data && !Array.isArray(data) ? data : null);
      } catch (err) {
        console.warn("Could not fetch room by slug from API, checking fallback:", err);
        // Fallback match by slug
        currentRoomData = FALLBACK_ROOMS.find(
          (r) => r.slug === slug || r._id === slug
        );
      }

      if (!currentRoomData) {
        // Fallback default if not found
        currentRoomData =
          FALLBACK_ROOMS.find((r) => r.slug === slug) || FALLBACK_ROOMS[0];
      }

      setRoom(currentRoomData);

      // 2. Fetch All Rooms & Filter Similar Rooms
      try {
        const allRes = await fetchRoomsApi();
        const data = allRes?.data;
        const allRooms = Array.isArray(data)
          ? data
          : Array.isArray(data?.rooms)
          ? data.rooms
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const pool = allRooms.length > 0 ? allRooms : FALLBACK_ROOMS;

        // Exclude current room
        const candidates = pool.filter((r) => {
          const matchId =
            currentRoomData._id && r._id && r._id === currentRoomData._id;
          const matchSlug =
            currentRoomData.slug && r.slug && r.slug === currentRoomData.slug;
          return !matchId && !matchSlug;
        });

        const targetCat = currentRoomData.category?.toLowerCase() || "";
        const targetPrice =
          currentRoomData.pricePerNight ?? currentRoomData.price ?? 0;

        // Rank by matching category first, then price closeness
        const ranked = [...candidates].sort((a, b) => {
          const aSame = a.category?.toLowerCase() === targetCat ? 1 : 0;
          const bSame = b.category?.toLowerCase() === targetCat ? 1 : 0;
          if (aSame !== bSame) return bSame - aSame;

          const aPriceDiff = Math.abs(
            (a.pricePerNight ?? a.price ?? 0) - targetPrice
          );
          const bPriceDiff = Math.abs(
            (b.pricePerNight ?? b.price ?? 0) - targetPrice
          );
          return aPriceDiff - bPriceDiff;
        });

        setSimilarRooms(ranked.slice(0, 3));
      } catch (err) {
        console.warn("Error fetching similar rooms:", err);
        const fallbackSimilar = FALLBACK_ROOMS.filter(
          (r) => r.slug !== currentRoomData.slug && r._id !== currentRoomData._id
        ).slice(0, 3);
        setSimilarRooms(fallbackSimilar);
      } finally {
        setLoading(false);
      }
    };

    loadRoomAndSimilar();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-[460px] bg-gray-200 rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-28"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-red-50 border border-red-200 rounded-3xl text-center text-red-600 shadow-sm">
        <p className="font-bold text-lg">Unable to load suite</p>
        <p className="text-sm mt-2 text-gray-600">{error}</p>
        <Link
          to="/rooms"
          className="inline-block mt-6 px-6 py-2.5 rounded-full bg-[#0C6478] text-white text-sm font-semibold hover:bg-[#094d5c] transition"
        >
          Explore All Rooms
        </Link>
      </div>
    );
  }

  if (!room) return null;

  // Extract all available images into a clean array of URL strings
  const rawImages = Array.isArray(room.images) && room.images.length > 0
    ? room.images.map((img) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
    : [];

  const imageGallery =
    rawImages.length > 0
      ? rawImages
      : room.image
      ? [room.image]
      : room.imageUrl
      ? [room.imageUrl]
      : [DEFAULT_ROOM_IMAGE];

  const currentImage = imageGallery[activeImageIndex] || imageGallery[0] || DEFAULT_ROOM_IMAGE;
  const price = room.pricePerNight ?? room.price ?? 0;

  return (
    <main className="bg-gray-50/50 min-h-screen py-10 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#0C6478] transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/rooms" className="hover:text-[#0C6478] transition">
            Rooms & Suites
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">
            {room.name}
          </span>
        </div>

        {/* Hero Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Image Gallery & Suite Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Main Image Container */}
            <div className="relative group overflow-hidden rounded-3xl bg-gray-100 shadow-md border border-gray-100">
              <img
                src={currentImage}
                alt={room.name || "Hotel Room"}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_ROOM_IMAGE;
                }}
                className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {room.category && (
                  <span className="bg-[#0C6478] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                    {room.category}
                  </span>
                )}
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#0BD0C7]" />
                  Verified Luxury
                </span>
              </div>

              {/* Photos Counter */}
              {imageGallery.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                  {activeImageIndex + 1} of {imageGallery.length} photos
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (when room has multiple photos) */}
            {imageGallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {imageGallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 transition-all border-2 ${
                      activeImageIndex === idx
                        ? "border-[#0C6478] ring-2 ring-[#0C6478]/30 scale-102"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Suite view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Suite Specifications Highlights (4 Cards) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Suite Key Highlights
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50/80 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#0C6478] mb-2.5">
                    <BedDouble size={20} />
                  </div>
                  <span className="text-xs text-gray-500">Bed Setup</span>
                  <span className="text-sm font-semibold text-gray-900 capitalize">
                    {room.numberOfBeds || 1} {room.bedType || "King Bed"}
                  </span>
                </div>

                <div className="bg-gray-50/80 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#0C6478] mb-2.5">
                    <Users size={20} />
                  </div>
                  <span className="text-xs text-gray-500">Max Guests</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {room.maximumAdults || 2} Adults
                    {room.maximumChildren ? `, ${room.maximumChildren} Kids` : ""}
                  </span>
                </div>

                <div className="bg-gray-50/80 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#0C6478] mb-2.5">
                    <Maximize2 size={20} />
                  </div>
                  <span className="text-xs text-gray-500">Room Area</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {room.roomSize ? `${room.roomSize} m²` : "48 m²"}
                  </span>
                </div>

                <div className="bg-gray-50/80 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#0C6478] mb-2.5">
                    <DoorOpen size={20} />
                  </div>
                  <span className="text-xs text-gray-500">Availability</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {room.totalRooms ? `${room.totalRooms} Units` : "Available"}
                  </span>
                </div>
              </div>
            </div>

            {/* In-Room Amenities Section */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles size={20} className="text-[#0C6478]" />
                  Premium Amenities & Comforts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {room.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-800 text-sm font-medium"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check size={14} strokeWidth={2.5} />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotel House Rules & Stay Experience */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-[#0C6478]" />
                House Policies & Check-in
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Check-in Time</span>
                    <span className="font-semibold text-gray-900">2:00 PM onwards</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Check-out Time</span>
                    <span className="font-semibold text-gray-900">Until 12:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Cancellation</span>
                    <span className="font-semibold text-emerald-600">Free within 24h</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Smoking Policy</span>
                    <span className="font-semibold text-gray-900">100% Non-Smoking</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Front Desk</span>
                    <span className="font-semibold text-gray-900">24/7 Concierge</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Valet Parking</span>
                    <span className="font-semibold text-gray-900">Complimentary</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking & Information Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* Primary Booking Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-lg">
              
              {/* Header Rating & Room Title */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-400">
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  4.95 (140+ reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                {room.name}
              </h1>

              {/* Price Display */}
              <div className="bg-teal-50/60 p-4 rounded-2xl mb-6 border border-teal-100/60">
                <span className="text-xs uppercase font-semibold tracking-wider text-teal-800 block mb-1">
                  Starting Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#0C6478]">
                    ₦{Number(price).toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-gray-500">/ night</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Taxes & luxury hospitality fees included
                </p>
              </div>

              {/* Room Description Preview */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {room.description ||
                  "Indulge in unmatched relaxation and comfort with bespoke luxury amenities designed exclusively for your stay."}
              </p>

              {/* Book Now Button */}
              <Link
                to={`/booking?room=${room.slug || room._id || ""}`}
                state={{ room }}
                className="w-full flex items-center justify-center gap-2 bg-[#0C6478] hover:bg-[#094d5c] text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-center text-base"
              >
                <span>Reserve This Suite Now</span>
                <ArrowRight size={18} />
              </Link>

              {/* Guarantees List */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-xs text-gray-500">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-[#0BD0C7] shrink-0" />
                  <span>Best Rate Guaranteed direct from Mamanla Hotel</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#0BD0C7] shrink-0" />
                  <span>Instant booking confirmation via email</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-[#0BD0C7] shrink-0" />
                  <span>Free cancellation up to 24 hours prior to check-in</span>
                </div>
              </div>
            </div>

            {/* Concierge Assistance Card */}
            <div className="bg-gradient-to-br from-[#0c6478] to-[#084553] text-white p-6 rounded-3xl shadow-md">
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                <Phone size={18} className="text-[#0BD0C7]" />
                Need Personalized Assistance?
              </h3>
              <p className="text-teal-100 text-xs leading-relaxed mb-4">
                Our 24/7 guest concierge team is standing by to assist with special room requests, airport transfers, or custom arrangements.
              </p>
              <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-white/10">
                <span>Direct Line:</span>
                <span className="text-[#0BD0C7]">+234 800 MAMANLA</span>
              </div>
            </div>

          </div>

        </div>

        {/* 🌟 SIMILAR ROOMS SECTION AT THE BOTTOM */}
        {similarRooms.length > 0 && (
          <section className="mt-24 pt-16 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-xs uppercase font-semibold tracking-widest text-[#0C6478] mb-2">
                  Tailored Recommendations
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Similar Suites You Might Love
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Handpicked suites sharing similar luxury, category, and comfort standards.
                </p>
              </div>

              <Link
                to="/rooms"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0C6478] hover:text-[#094d5c] transition"
              >
                <span>View All Rooms</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Similar Rooms Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarRooms.map((simRoom, index) => (
                <RoomCard
                  key={simRoom._id || simRoom.id || index}
                  room={simRoom}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
};

export default RoomDetails;
