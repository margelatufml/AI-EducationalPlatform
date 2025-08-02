import React, { useState, useEffect, useCallback } from "react";
import SimpleCarouselItem from "./Item";
import "tailwindcss/tailwind.css";
import "./carousel.css";
import TropheeImage from "../Carousel/images/imagine_1_carusel.png";
import Brain from "../Carousel/images/imagine_pentru_carusel_3.png";
import Equation from "../Carousel/images/imaginea_pentru_carusel_2.png";

const SimpleCarousel = () => {
  const items = [
    {
      title: "Concurează.Câștigă. Cu Prieteni",
      imageUrl: TropheeImage,
    },
    {
      title: "Înțelege. Învață. Exerseaza",
      imageUrl: Equation,
    },
    {
      title: "Învățare Personalizată",
      imageUrl: Brain,
      isBlurred: true, // Indicate that this item should be blurred
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("");

  const handlePrev = useCallback(() => {
    setAnimationClass("slide-out-right");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? items.length - 1 : prevIndex - 1
      );
      setAnimationClass("slide-in-left");
    }, 500);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setAnimationClass("slide-out-left");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
      setAnimationClass("slide-in-right");
    }, 500);
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(timer);
  }, [handleNext]);

  const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;

  return (
    <div className="w-screen flex flex-col justify-center items-center text-white pt-10 mb-10">
      <div className="relative w-9/10 flex items-center justify-center overflow-hidden">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 z-10 bg-gray-700 rounded-full"
          onClick={handlePrev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex items-center justify-center ">
          <SimpleCarouselItem
            title={items[prevIndex].title}
            imageUrl={items[prevIndex].imageUrl}
            opacity={0.2}
            scale={0.55}
          />
          <SimpleCarouselItem
            title={items[currentIndex].title}
            imageUrl={items[currentIndex].imageUrl}
            opacity={1}
            scale={1}
            animationClass={animationClass}
            isBlurred={items[currentIndex].isBlurred} // Pass the isBlurred prop
          />
          <SimpleCarouselItem
            title={items[nextIndex].title}
            imageUrl={items[nextIndex].imageUrl}
            opacity={0.2}
            scale={0.55}
          />
        </div>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 z-10 bg-gray-700 rounded-full"
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SimpleCarousel;
