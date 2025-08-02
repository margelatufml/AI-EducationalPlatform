import React from "react";

const SimpleCarouselItem = ({
  title,
  imageUrl,
  opacity = 1,
  scale = 1,
  animationClass = "",
  isBlurred = false, // Prop to check if the item should be blurred
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center transform transition-transform duration-500 ${animationClass}`}
      style={{ opacity, transform: `scale(${scale})` }}
    >
      <div className={`flex flex-col items-center ${isBlurred ? "blur-sm" : ""}`}> {/* Apply blur to both text and image */}
        <h3 className="text-3xl font-semibold mb-4">{title}</h3>
        <img
          src={imageUrl}
          alt={title}
          className="w-3/5 h-auto mt-8"
        />
      </div>
      {isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white text-4xl font-bold">Coming Soon</span>
        </div>
      )}
    </div>
  );
};

export default SimpleCarouselItem;
