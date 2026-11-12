
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const offers = [
  {
    category: "WEEKEND SPECIAL",
    discount: "25% OFF",
    title: "Weekend Getaway",
    description:
      "25% off Friday to Sunday stays, complimentary chilled sparkling wine upon arrival, and relaxed 3:00 PM late check-out.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=85",
    badgeColor: "bg-[#315F63]",
  },
  {
    category: "SAVE 35%",
    discount: "5+ Nights",
    title: "Extended Stay Discount",
    description:
      "Save 35% on stays of 5 nights or more, including daily complimentary buffet breakfast and daily pressing/laundry credits.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85",
    badgeColor: "bg-[#315F63]",
  },
  {
    category: "ROMANCE PACKAGE",
    discount: "All Inclusive",
    title: "Couple's Retreat",
    description:
      "Romantic candlelit 4-course dinner for two, complimentary couples' aromatherapy massage, and rose petal evening turndown.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85",
    badgeColor: "bg-[#315F63]",
  },
];

const SpecialOffers = () => {
  return (
    <section className="w-full bg-[#F4F5F1] py-20 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">

          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#527579] mb-3">
              Seasonal Privileges
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold text-[#293F4A] mb-3">
              Enjoy More with Our Special Offers
            </h2>

            <p className="text-sm sm:text-base text-gray-600">
              Exclusive curated packages and limited-time coastal retreat privileges.
            </p>
          </div>

          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#315F63] hover:text-[#0C6478] transition whitespace-nowrap"
          >
            View All Packages
            <ArrowRight size={16} />
          </Link>

        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-[#FBFAF5] rounded-2xl overflow-hidden border border-[#E7E9E3] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >

              {/* Image Container */}
              <div className="relative h-52 sm:h-56 overflow-hidden group">

                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Image Overlay */}
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Category Badge */}
                <span className={`absolute top-4 left-4 ${offer.badgeColor} text-white text-[9px] font-bold tracking-wider px-3 py-1.5 rounded-full`}>
                  {offer.category}
                </span>

                {/* Discount Badge */}
                <span className="absolute bottom-4 right-4 bg-[#A8E3CF] text-[#245B50] text-[10px] font-bold px-3 py-1.5 rounded-full">
                  {offer.discount}
                </span>

              </div>

              {/* Offer Details */}
              <div className="p-6 flex flex-col flex-grow">

                <h3 className="text-xl font-semibold text-[#30474D] mb-2">
                  {offer.title}
                </h3>

                <p className="text-sm text-gray-600 leading-6 mb-6 flex-grow">
                  {offer.description}
                </p>

                {/* Claim Offer Button */}
                <Link
                  to="/rooms"
                  className="w-full flex items-center justify-center gap-2 bg-[#E7F0EC] hover:bg-[#0C6478] text-[#315F63] hover:text-white font-semibold text-sm py-3 rounded-xl transition-all duration-300"
                >
                  Claim Offer
                  <ArrowRight size={15} />
                </Link>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;