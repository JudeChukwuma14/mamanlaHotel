import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import RoomCard from "../components/RoomCard";
import { PREVIEW_ROOMS, fetchFeaturedRoomsApi } from "../api/roomService";

const Home = () => {
  const [rooms, setRooms] = useState(PREVIEW_ROOMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchFeaturedRoomsApi()
      .then((data) => {
        if (isMounted) {
          setRooms(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRooms(PREVIEW_ROOMS);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
              Your Comfort,
              <span className="text-[#0BD0C7]"> Our Priority.</span>
            </h1>

            <p className="text-gray-200 text-base md:text-lg leading-8 mb-9">
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

              <Link
                to="/booking"
                className="border border-white px-7 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0C6478] transition"
              >
                Book Your Stay
              </Link>
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
