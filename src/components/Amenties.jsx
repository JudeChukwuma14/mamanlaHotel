
import React from "react";
import {
  Waves,
  Utensils,
  Wifi,
  Dumbbell,
  Presentation,
  ConciergeBell,
  CarFront,
  ParkingCircle,
} from "lucide-react";

const amenities = [
  {
    icon: Waves,
    title: "Swimming Pool",
    description:
      "Infinity heated rooftop pool with luxury private cabanas and panoramic sunset cityscape views.",
  },
  {
    icon: Utensils,
    title: "Restaurant & Bar",
    description:
      "Signature culinary journey featuring Michelin trained chefs, seafood delicacies, and artisanal mixology.",
  },
  {
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    description:
      "Enterprise gigabit fiber connectivity throughout all suites, private terraces, and gardens.",
  },
  {
    icon: Dumbbell,
    title: "Gym & Fitness Centre",
    description:
      "Technogym cardio stations, free weights, personal trainers, and a serene yoga studio.",
  },
  {
    icon: Presentation,
    title: "Conference Facilities",
    description:
      "State-of-the-art multimedia executive boardrooms and banquet spaces with simultaneous translation.",
  },
  {
    icon: ConciergeBell,
    title: "24/7 Room Service",
    description:
      "Full gourmet dining and sommelier service delivered directly to your bedside within minutes.",
  },
  {
    icon: CarFront,
    title: "Airport Pickup",
    description:
      "Chauffeur-driven luxury EV and Mercedes S-Class transfers with a familiar reception concierge.",
  },
  {
    icon: ParkingCircle,
    title: "Free Valet Parking",
    description:
      "Complimentary secured underground parking with 24/7 camera surveillance and rapid EV chargers.",
  },
];

const Amenities = () => {
  return (
    <section className="w-full bg-[#F3F5F1] py-20 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#54777A] mb-3">
            Tailored Living
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#293F4A] mb-4">
            World-Class Amenities & Facilities
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Curated experiences designed to enrich, rejuvenate, and delight your stay.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;

            return (
              <div
                key={index}
                className="bg-[#FBFAF5] p-7 rounded-xl border border-[#ECEDE7] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="w-13 h-13 bg-[#D9F0E9] rounded-xl flex items-center justify-center mb-5">
                  <Icon
                    size={24}
                    strokeWidth={2}
                    className="text-[#315F63]"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[#344B52] mb-2">
                  {amenity.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-6">
                  {amenity.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Amenities;