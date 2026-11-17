
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const RoomDetails = () => {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/rooms/${slug}`);
        const data = response.data;
        setRoom(data.room || data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Could not load room details');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-gray-500 animate-pulse">
        Loading room details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-24 p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-600">
        <p className="font-semibold">Error loading room</p>
        <p className="text-sm mt-1">{error}</p>
        <Link to="/" className="inline-block mt-4 text-sm font-medium text-teal-700 underline">
          Return to Homepage
        </Link>
      </div>
    );
  }

  if (!room) return null;

  const mainImageUrl = room.images && room.images[0]?.url 
    ? room.images[0].url 
    : "https://unsplash.com";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900">
      <Link to="/" className="text-sm font-medium text-teal-700 hover:text-teal-600 inline-flex items-center gap-1 mb-8">
        ← Back to Homepage
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img 
            src={mainImageUrl} 
            alt={room.name || 'Hotel Room'} 
            className="w-full h-[450px] object-cover rounded-3xl shadow-sm bg-gray-100"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            {room.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 uppercase tracking-wide mb-4">
                {room.category}
              </span>
            )}
            <h1 className="text-4xl font-bold tracking-tight mb-2">{room.name}</h1>
            <p className="text-2xl font-semibold mb-6">
              ₦{room.pricePerNight?.toLocaleString() || '0'} <span className="text-sm font-normal text-gray-500">/ night</span>
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">{room.description}</p>

            <div className="border-t border-b border-gray-100 py-4 my-6 grid grid-cols-2 gap-4 text-sm">
              <div>🛏️ Bed: <span className="font-medium capitalize">{room.numberOfBeds} {room.bedType}</span></div>
              <div>👥 Max Guests: <span className="font-medium">{room.maximumAdults} Adults, {room.maximumChildren} Children</span></div>
              {room.roomSize && <div>📐 Size: <span className="font-medium">{room.roomSize} sqm</span></div>}
              {room.totalRooms && <div>🚪 Available Units: <span className="font-medium">{room.totalRooms}</span></div>}
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <>
                <h3 className="font-semibold mb-3">Room Amenities:</h3>
                <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  {room.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-teal-600">✓</span> {amenity}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <Link 
            to="/booking" 
            className="w-full mt-8 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-4 rounded-xl text-center shadow-sm transition"
          >
            Book This Room Now
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RoomDetails;