
import React from "react";
import {
  BedDouble,
  Headset,
  ShieldCheck,
  Award,
} from "lucide-react";

const features = [
  {
    icon: BedDouble,
    title: "Comfortable Accommodation",
    description:
      "Crafted with hypoallergenic Egyptian cotton linens, ergonomic architecture, and acoustic soundproofing for deep, restorative sleep.",
  },
  {
    icon: Headset,
    title: "24/7 Customer Support",
    description:
      "Around-the-clock multilingual concierge, private guest relations, and immediate service assistance at the touch of your tablet.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Online Booking",
    description:
      "Bank-grade encrypted reservation engine with instant confirmation, locked best-rate guarantee, and transparent cancellation policies.",
  },
  {
    icon: Award,
    title: "Premium Hospitality",
    description:
      "Warm, anticipatory service tailored to your personal habits and preferences from arrival curbside to final checkout.",
  },
];

const Distinction = () => {
  return (
    <section className="w-full bg-[#F3F6F2] py-20 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#527579] mb-3">
            Uncompromising Quality
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#29434A] mb-4">
            The Mamanla Distinction
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Why discerning travelers and corporate leaders choose us time and again.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-[#FBFAF5] p-7 rounded-xl border border-[#E8EDE8] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#E8F0ED] flex items-center justify-center mb-6">
                  <Icon
                    size={24}
                    strokeWidth={1.8}
                    className="text-[#315B62]"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[#29434A] mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Distinction;