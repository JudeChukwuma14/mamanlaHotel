import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, RefreshCw, AlertCircle } from "lucide-react";
import RoomCard from "../components/RoomCard";
import axiosInstance from "../api/axiosInstance";

// Fallback preview rooms when backend is unreachable
// const PREVIEW_ROOMS = [
//   {
//     _id: "preview-1",
//     name: "Deluxe Ocean Suite",
//     description:
//       "Panoramic ocean views, plush king-size bed, private sunset balcony, and luxury marble bathroom.",
//     pricePerNight: 120000,
//     slug: "deluxe-ocean-suite",
//     images: [
//       {
//         url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
//       },
//     ],
//   },
//   {
//     _id: "preview-2",
//     name: "Presidential Penthouse",
//     description:
//       "Exclusive top-floor suite featuring private infinity jacuzzi, personal concierge, and expansive lounge.",
//     pricePerNight: 280000,
//     slug: "presidential-penthouse",
//     images: [
//       {
//         url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
//       },
//     ],
//   },
//   {
//     _id: "preview-3",
//     name: "Executive Garden Villa",
//     description:
//       "Secluded tropical sanctuary surrounded by lush private gardens, featuring a plunge pool and bespoke amenities.",
//     pricePerNight: 175000,
//     slug: "executive-garden-villa",
//     images: [
//       {
//         url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
//       },
//     ],
//   },
// ];

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFeaturedRooms = useCallback(async () => {
    setLoading(true);
    setBackendOffline(false);
    setErrorMessage("");

    try {
      let response;
      try {
        response = await axiosInstance.get("/api/v1/rooms/featured");
      } catch (firstErr) {
        // If /api/v1/rooms/featured is 404, fallback to /rooms/featured
        if (firstErr.response?.status === 404) {
          response = await axiosInstance.get("/rooms/featured");
        } else {
          throw firstErr;
        }
      }

      const data = response?.data;
      console.log("Backend Data Response:", data);

      // Robust extraction across different backend response patterns
      const roomList = Array.isArray(data)
        ? data
        : Array.isArray(data?.rooms)
          ? data.rooms
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.rooms)
              ? data.data.rooms
              : Array.isArray(data?.featuredRooms)
                ? data.featuredRooms
                : [];

      if (roomList.length > 0) {
        setRooms(roomList);
        setBackendOffline(false);
      } else {
        // Backend reached but no rooms in database yet -> use preview rooms
        setRooms([]);
      }
    } catch (err) {
      console.error("Error fetching featured rooms:", err);
      setBackendOffline(true);
      setErrorMessage(
        err.code === "ERR_NETWORK" || err.message?.includes("Network Error")
          ? "Backend server is not running or unreachable"
          : err.response?.data?.message || err.message || "Failed to load rooms"
      );
      // Keep preview rooms visible so page is never empty
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedRooms();
  }, [fetchFeaturedRooms]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[650px] lg:min-h-[750px] flex items-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/media-bg.mp4" type="video/mp4" />
          Your browser does not support video.
        </video>

        {/* Luxury Brand Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03151b]/90 via-[#062c35]/50 to-black/25"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-[#0BD0C7] fill-[#0BD0C7]" size={18} />
              <span className="text-sm uppercase tracking-widest">
                Your perfect stay starts here
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-md">
              Your Comfort,
              <span className="text-[#0BD0C7]"> Our Priority.</span>
            </h1>

            <p className="text-gray-200 text-base md:text-lg leading-8 mb-9 drop-shadow-sm">
              Experience exceptional hospitality, relaxing spaces, and
              unforgettable stays at Mamanla Hotel & Co.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/rooms"
                className="bg-[#0C6478] hover:bg-[#094d5c] px-7 py-4 rounded-full font-semibold flex items-center gap-2 transition"
              >
                Explore Rooms
                <ArrowRight size={18} />
              </Link>

              <a
                href="#booking"
                className="border border-white px-7 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0C6478] transition"
              >
                Book Your Stay
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 FEATURED ROOMS GRID */}
      <section className="bg-gray-50 py-16 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Luxuries
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Handpicked premium hotel suites for your stay.
            </p>
          </div>

          {/* {backendOffline && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto text-amber-900 text-sm">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="text-amber-600 shrink-0" />
                <span>
                  <strong>Preview Mode:</strong> {errorMessage}. (Showing sample suites below).
                </span>
              </div>
              {<button
                onClick={fetchFeaturedRooms}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0C6478] hover:bg-[#094d5c] text-white rounded-full text-xs font-semibold transition shrink-0"
              >
                <RefreshCw size={13} />
                Retry Connection
              </button>}
            </div>
          )} */}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="border border-gray-200 rounded-2xl bg-white h-[400px] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => (
                <RoomCard key={room._id || room.id || index} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
