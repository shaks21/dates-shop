"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type AlternatingImagesProps = {
  images: string[];
  interval?: number;
  dark?: boolean;
  showIndicators?: boolean;
  className?: string;
  children?: React.ReactNode; // 👈 Allow children (e.g. hero text)
};

export default function AlternatingImages({
  images,
  interval = 5000,
  dark = false,
  showIndicators = true,
  className = "",
  children,
}: AlternatingImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-xl ${className}`}>
      {/* Background Images */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${i + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      ))}

      {/* ✅ Single unified overlay (shared across all images) */}
      <div
        className={`absolute inset-0 ${
          dark
            ? "bg-gradient-to-br from-black/60 via-black/50 to-black/70"
            : "bg-gradient-to-br from-black/40 via-black/30 to-black/50"
        }`}
      />

      {/* ✅ Render children (e.g. hero text) on top of everything */}
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8 z-10">
          {children}
        </div>
      )}

      {/* Slide Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              className={`w-3 h-3 rounded-full border border-white/50 transition-all duration-300 ${
                i === currentIndex
                  ? "bg-white shadow-lg scale-110"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}