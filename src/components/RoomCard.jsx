import React from "react";
import { Link } from "react-router-dom";

const DEFAULT_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

const RoomCard = ({ room }) => {
  // Extract image path safely whether it's an object with .url, a string, or image field
  const getImage = () => {
    if (!room) return DEFAULT_ROOM_IMAGE;
    if (Array.isArray(room.images) && room.images.length > 0) {
      const first = room.images[0];
      if (typeof first === "string" && first.trim()) return first;
      if (first?.url) return first.url;
    }
    if (typeof room.image === "string" && room.image.trim()) return room.image;
    if (typeof room.imageUrl === "string" && room.imageUrl.trim())
      return room.imageUrl;
    return DEFAULT_ROOM_IMAGE;
  };

  const price = room?.pricePerNight ?? room?.price ?? 0;
  const roomPath = room?.slug
    ? `/rooms/${room.slug}`
    : room?._id
      ? `/rooms/${room._id}`
      : "/rooms";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      {/* Room Image Container */}
      <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
        <img
          src={getImage()}
          alt={room?.name || "Hotel Room"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_ROOM_IMAGE;
          }}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
          ₦{Number(price).toLocaleString()} / night
        </div>
      </div>

      {/* Info Details Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {room?.name || "Luxury Room"}
        </h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
          {room?.description || "Experience comfort and relaxation in our premier suite."}
        </p>

        {/* Dynamic Navigation Trigger Link */}
        <Link
          to={roomPath}
          className="w-full block bg-[#0C6478] hover:bg-[#094d5c] text-white font-medium py-2.5 rounded-xl transition text-center text-sm shadow-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
