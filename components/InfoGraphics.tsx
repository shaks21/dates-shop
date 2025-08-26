import React, { useState, useEffect, useRef, JSX } from "react";
import { RotateCcw } from "lucide-react";
import Image from "next/image";

const images: string[] = [
  "/superfood_infographics1.jpg",
  "/superfood_infographics2.jpg",
  "/superfood_infographics3.jpg",
  "/superfood_infographics4.jpg",
  "/superfood_infographics5.jpg",
  "/superfood_infographics6.jpg",
];

export default function InfoGraphics(): JSX.Element {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isCycling, setIsCycling] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Start cycling only when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCycling(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // Automatically cycle images every 1 second when isCycling
  useEffect(() => {
    if (!isCycling) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = prev + 1;
        if (next >= images.length) {
          setIsCycling(false); // Stop at last image
          return prev;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCycling]);

  const handleResetClick = (): void => {
    setCurrentImageIndex(0);
    setIsCycling(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen max-md:h-[50vh] overflow-hidden bg-white"
    >
      {/* Progress indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentImageIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Main image */}
      <Image
        src={images[currentImageIndex]}
        alt={`Superfood infographic ${currentImageIndex + 1}`}
        className="absolute w-full h-full object-contain transition-all duration-300"
        loading="lazy"
        width={800}
        height={600}
      />

      {/* Reset button when at the end */}
      {!isCycling && currentImageIndex === images.length - 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-blue-600 cursor-pointer">
          <RotateCcw onClick={handleResetClick} />
        </div>
      )}
    </div>
  );
}
