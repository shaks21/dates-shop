import { useState } from "react";
import Image from "next/image";

const images = [
  "/superfood.jpeg",
  "/energy2.jpeg",
  "/brain.jpeg",
  "/heart.jpeg",
  "/natural2.jpeg",
  "/heart2.jpeg",
];

export default function OrbitImageSelector() {
  const [centerImage, setCenterImage] = useState(images[0]);

  return (
    <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] mx-auto">
      {/* Center Image */}
      <Image
        src={centerImage}
        alt="center"
        className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full object-cover -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-lg z-10"
      />

      {/* Rotating Ring */}
      <div className="absolute inset-0 animate-spin-slow">
        {images.map((img, i) => {
          const angle = (i / images.length) * 360;
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `rotate(${angle}deg) translate(120px) rotate(-${angle}deg)`,
                transformOrigin: "0 0",
                willChange: "transform"
              }}
            >
              <Image
                src={img}
                alt={`orbit-${i}`}
                onClick={() => setCenterImage(img)}
                className="w-full h-full rounded-full object-cover border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}