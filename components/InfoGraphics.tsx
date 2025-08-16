import React, { useState, useEffect, useRef } from 'react';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';

const images = [
  '/superfood_infographics1.jpg',
  '/superfood_infographics2.jpg',
  '/superfood_infographics3.jpg',
  '/superfood_infographics4.jpg',
  '/superfood_infographics5.jpg',
  '/superfood_infographics6.jpg',
];

export default function InfoGraphics() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);

  // Lock scroll only if we're in the middle of the sequence
  useBodyScrollLock(isInView && currentImageIndex > 0 && currentImageIndex < images.length - 1);

  // Pointer events handle mouse + touch
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      startY.current = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (startY.current === null || !isInView || isScrolling) return;

      const deltaY = e.clientY - startY.current;
      const direction = deltaY < -50 ? 1 : 0; // ✅ only allow down swipe

      if (direction === 1 && currentImageIndex < images.length - 1) {
        triggerImageChange(1);
      }

      startY.current = null;
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [currentImageIndex, isScrolling, isInView]);

  // Wheel fallback (desktop scroll wheel)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isInView || isScrolling) return;

      const direction = e.deltaY > 0 ? 1 : 0; // ✅ only allow down
      if (direction === 1 && currentImageIndex < images.length - 1) {
        e.preventDefault();
        triggerImageChange(1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentImageIndex, isScrolling, isInView]);

  const triggerImageChange = (direction: number) => {
    setIsScrolling(true);
    setCurrentImageIndex((prev) =>
      Math.min(images.length - 1, prev + direction)
    );
    setTimeout(() => setIsScrolling(false), 200);
  };

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.6 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <img
        src={images[currentImageIndex]}
        alt="Main infographic"
        className="absolute top-1/2 left-1/2 w-3/4 h-3/4 object-contain transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
      />
    </div>
  );
}
