"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type AlternatingImagesProps = {
  images: string[];
  interval?: number; // in milliseconds
};

export default function AlternatingImages({
  images,
  interval = 5000,
}: AlternatingImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${i + 1}`}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Button indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20 ">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToIndex(i)}
            className={`w-3 h-3 rounded-full hover:cursor-pointer shadow-lg shadow-black/60 ${
              i === currentIndex ? "bg-black" : "bg-white"
            } transition-colors`}
            aria-label={`Select image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
