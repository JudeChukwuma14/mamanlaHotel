
import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import axiosInstance from '../api/axiosInstance';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states for search and category
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/rooms');
        const data = response.data;
        
        // Safely extract the rooms array from the response object
        if (data && Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        } else if (Array.isArray(data)) {
          setRooms(data);
        } else {
          setRooms([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Could not load rooms catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchAllRooms();
  }, []);

  // Dynamically extract unique categories from the fetched rooms
  const categories = ['all', ...new Set(rooms.map((room) => room.category?.toLowerCase()).filter(Boolean))];

  // Filter rooms based on user search text and chosen category
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || room.category?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="bg-gray-50 min-h-screen py-16 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Rooms & Suites
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Explore our full collection of comfortable rooms tailored for your stay.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search rooms by name or features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                  selectedCategory === category
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Rooms Display Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-gray-200 rounded-2xl bg-white h-[400px] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 bg-red-50 rounded-2xl border border-red-200 max-w-md mx-auto">
            {error}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-lg">No rooms match your current search or filter.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-sm font-semibold text-teal-700 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Rooms;