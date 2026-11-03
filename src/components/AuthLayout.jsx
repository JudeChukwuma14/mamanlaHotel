import React from "react";
import AuthImageSlider from "./AuthImageSlider";

const hotelImages = [
  {
    src: "https://i.pinimg.com/1200x/15/ca/4a/15ca4ad998f43fcb424d909b40590bf4.jpg",
    alt: "Luxurious hotel lobby",
    caption: "Welcome to Mama La Hotel",
  },
  {
    src: "https://i.pinimg.com/736x/af/8a/ec/af8aecc9176653b8b4a1115c2b3a2586.jpg",
    alt: "Elegant hotel room",
    caption: "Experience Comfort & Style",
  },
  {
    src: "https://i.pinimg.com/736x/d9/c9/58/d9c9581f88d6441852d17f300d7c6f32.jpg",
    alt: "Hotel pool and garden",
    caption: "Relax and Unwind",
  },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex-col bg-[#f5fbfb] overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div className="flex flex-col md:flex-row flex-1 md:h-full">
        {/* Form column — scrollable with no visible scrollbar */}
        <main className="flex-1 md:w-[55%] md:h-full flex-col px-6 py-8 sm:px-10 lg:px-16 order-2 md:order-1 overflow-y-auto overflow-x-hidden no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <div className="w-full max-w-lg mx-auto my-auto flex flex-col">
            {/* Mobile image panel — visible only on mobile, sits above form content */}
            <div className="hidden w-full h-52 mb-6 rounded-xl overflow-hidden shrink-0 shadow-sm">
              <AuthImageSlider images={hotelImages} />
            </div>
            {children}
          </div>
        </main>

        {/* Image column — right on desktop, pinned & hidden on mobile */}
        <div className="hidden md:block md:w-[45%] md:h-full md:order-2 relative shrink-0 overflow-hidden">
          <AuthImageSlider images={hotelImages} />
        </div>
      </div>
    </div>
  );
}
