import React, { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    title: "Manager",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: 2,
    title: "Bussiness & Management",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.!",
  },
  {
    id: 4,
    title: "Software Developer",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: 5,
    title: "AI specialist",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
];

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-32 mb-40 p-10 bg-transparent rounded-lg ">
      <h2 className="text-3xl font-bold text-white mb-8">Echipa noastra</h2>
      <div
        className="flex flex-col items-center justify-center bg-transparent rounded-lg shadow-md shadow-blue-mainpagebeforeLogin"
        style={{ width: "500px", height: "500px" }}
      >
        <h3 className="text-xl font-semibold text-blue-mainpagebeforeLogin p-2">
          {slides[currentSlide].title}
        </h3>
        <p className="text-center text-lg text-airforce-blue p-5 bg-transparent rounded-lg">
          {slides[currentSlide].text}
        </p>
      </div>
    </div>
  );
};

export default Slideshow;
