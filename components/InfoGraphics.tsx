import React, { useState, useEffect, useRef, JSX } from "react";
import { RotateCcw } from "lucide-react";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock";
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
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  // Lock scroll when in view and not at start/end
  useBodyScrollLock(
    isInView && currentImageIndex > 0 && currentImageIndex < images.length - 1
  );

  // Touch events for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent): void => {
      if (!isInView) return;
      startY.current = e.touches[0].clientY;
      startTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (!isInView || !startY.current) return;

      // Prevent default scrolling when we're handling the gesture
      if (currentImageIndex > 0 && currentImageIndex < images.length - 1) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent): void => {
      if (!isInView || startY.current === null || isScrolling) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = startY.current - endY; // Positive = swipe up
      const deltaTime = Date.now() - (startTime.current || 0);
      const velocity = Math.abs(deltaY) / deltaTime;

      // Require minimum swipe distance and reasonable velocity
      if (Math.abs(deltaY) > 50 || velocity > 0.3) {
        if (deltaY > 0 && currentImageIndex < images.length - 1) {
          // Ensure container is centered before starting sequence
          if (containerRef.current) {
            containerRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
          // Small delay to let scroll complete before image change
          setTimeout(() => triggerImageChange(1), 200);
        }
      }

      startY.current = null;
      startTime.current = null;
    };

    // Use passive: false to allow preventDefault
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentImageIndex, isScrolling, isInView]);

  // Mouse events for desktop
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent): void => {
      if (!isInView) return;
      startY.current = e.clientY;
      startTime.current = Date.now();
    };

    const handleMouseUp = (e: MouseEvent): void => {
      if (!isInView || startY.current === null || isScrolling) return;

      const deltaY = startY.current - e.clientY; // Positive = mouse moved up
      const deltaTime = Date.now() - (startTime.current || 0);

      // For mouse, require less distance but more deliberate movement
      if (Math.abs(deltaY) > 30 && deltaTime < 500) {
        if (deltaY > 0 && currentImageIndex < images.length - 1) {
          // Ensure container is centered before starting sequence
          if (containerRef.current) {
            containerRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
          setTimeout(() => triggerImageChange(1), 200);
        }
      }

      startY.current = null;
      startTime.current = null;
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentImageIndex, isScrolling, isInView]);

  // Wheel events for desktop scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent): void => {
      if (!isInView || isScrolling) return;

      // Only handle downward scroll
      if (e.deltaY > 0 && currentImageIndex < images.length - 1) {
        e.preventDefault();
        triggerImageChange(1);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, [currentImageIndex, isScrolling, isInView]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!isInView || isScrolling) return;

      if (
        (e.key === "ArrowDown" || e.key === " ") &&
        currentImageIndex < images.length - 1
      ) {
        e.preventDefault();
        triggerImageChange(1);
      } else if (e.key === "ArrowUp" && currentImageIndex > 0) {
        e.preventDefault();
        triggerImageChange(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentImageIndex, isScrolling, isInView]);

  const triggerImageChange = (direction: number): void => {
    // Ensure the container is in view when starting the scroll sequence
    if (containerRef.current && currentImageIndex === 0 && direction > 0) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    setIsScrolling(true);
    setCurrentImageIndex((prev) => {
      const newIndex = prev + direction;
      return Math.max(0, Math.min(images.length - 1, newIndex));
    });
    setTimeout(() => setIsScrolling(false), 300);
  };

  // Intersection observer with improved viewport handling
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);

        // If user starts interacting when component is partially visible,
        // scroll it into full view
        if (
          entry.isIntersecting &&
          entry.intersectionRatio < 0.8 &&
          currentImageIndex === images.length - 1
        ) {
          const handleScrollIntoView = () => {
            if (containerRef.current) {
              containerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          };

          // Small delay to avoid immediate scroll conflicts
          setTimeout(handleScrollIntoView, 100);
        }
      },
      { threshold: [0.1, 0.5, 0.8] }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleResetClick = (): void => {
    setCurrentImageIndex(0);
  };

  const handleImageClick = (): void => {
    if (isScrolling) return;
    if (currentImageIndex < images.length - 1) {
      triggerImageChange(1);
    } else {
      return; // do nothing on last image
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative  w-full h-screen max-md:h-[50vh] overflow-hidden bg-white"
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
        className="absolute  w-full h-full object-contain cursor-pointer transition-all duration-300"
        loading="lazy"
        width={800}
        height={600}
        onClick={handleImageClick}
      />

      {/* Navigation hint */}
      {currentImageIndex < images.length - 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-gray-600 text-sm mb-2">
            Scroll down or click for next
          </div>
          <div className="w-6 h-6 border-2 border-gray-400 rounded-full mx-auto animate-bounce">
            <div className="w-1 h-2 bg-gray-400 rounded-full mx-auto mt-1"></div>
          </div>
        </div>
      )}

      {/* Reset button when at the end */}
      {currentImageIndex === images.length - 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-blue-600">
          <RotateCcw onClick={handleResetClick} />
        </div>
      )}
    </div>
  );
}
