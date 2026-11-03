import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function usePrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function AuthImageSlider({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [imgError, setImgError] = useState({});
  const reducedMotion = usePrefersReducedMotion();

  const total = images.length;

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  }, [total]);

  const next = useCallback(() => {
    setCurrent((c) => (c === total - 1 ? 0 : c + 1));
  }, [total]);

  if (total === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0c6478] to-[#0bd0c7] flex items-center justify-center">
        <span className="text-white/60 text-sm">No images provided</span>
      </div>
    );
  }

  const slide = images[current];
  const hasError = imgError[current];

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      role="region"
      aria-label="Hotel image slideshow"
    >
      {/* Slides */}
      <div className="w-full h-full">
        {hasError ? (
          <div className="w-full h-full bg-gradient-to-br from-[#0c6478] to-[#0bd0c7] flex items-center justify-center">
            <div className="text-center text-white/80 px-6">
              <div className="text-5xl mb-4">🏨</div>
              <p className="font-semibold text-lg">
                {slide.caption || "Mama La Hotel"}
              </p>
            </div>
          </div>
        ) : (
          <img
            key={current}
            src={slide.src}
            alt={slide.alt}
            onError={() =>
              setImgError((prev) => ({ ...prev, [current]: true }))
            }
            className={`w-full h-full object-cover ${
              reducedMotion ? "" : "transition-opacity duration-500"
            }`}
            draggable={false}
          />
        )}

        {/* Caption overlay */}
        {slide.caption && !hasError && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-4">
            <p className="text-white font-semibold text-base drop-shadow">
              {slide.caption}
            </p>
          </div>
        )}
      </div>

      {/* Prev button */}
      {total > 1 && (
        <button
          type="button"
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7]"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Next button */}
      {total > 1 && (
        <button
          type="button"
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7]"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
          role="tablist"
          aria-label="Slide indicators"
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === current}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] ${
                idx === current
                  ? "bg-[#0bd0c7] scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
