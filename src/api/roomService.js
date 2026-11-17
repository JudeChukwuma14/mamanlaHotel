import axiosInstance from "./axiosInstance";

// Preview rooms matching Home.jsx fallback suites and prices (in Naira ₦)
export const PREVIEW_ROOMS = [
  {
    _id: "deluxe-ocean-suite",
    id: "deluxe-ocean-suite",
    name: "Deluxe Ocean Suite",
    description:
      "Panoramic ocean views, plush king-size bed, private sunset balcony, and luxury marble bathroom.",
    pricePerNight: 120000,
    price: 120000,
    slug: "deluxe-ocean-suite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    _id: "presidential-penthouse",
    id: "presidential-penthouse",
    name: "Presidential Penthouse",
    description:
      "Exclusive top-floor suite featuring private infinity jacuzzi, personal concierge, and expansive lounge.",
    pricePerNight: 280000,
    price: 280000,
    slug: "presidential-penthouse",
    images: [
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    _id: "executive-garden-villa",
    id: "executive-garden-villa",
    name: "Executive Garden Villa",
    description:
      "Secluded tropical sanctuary surrounded by lush private gardens, featuring a plunge pool and bespoke amenities.",
    pricePerNight: 175000,
    price: 175000,
    slug: "executive-garden-villa",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];

export const fetchFeaturedRoomsApi = async () => {
  try {
    let response;
    try {
      response = await axiosInstance.get("/api/v1/rooms/featured");
    } catch (firstErr) {
      if (firstErr.response?.status === 404) {
        response = await axiosInstance.get("/rooms/featured");
      } else {
        throw firstErr;
      }
    }

    const data = response?.data;
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

    return roomList.length > 0 ? roomList : PREVIEW_ROOMS;
  } catch {
    return PREVIEW_ROOMS;
  }
};

