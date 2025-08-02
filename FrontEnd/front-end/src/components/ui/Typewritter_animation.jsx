import React, { useState, useEffect } from "react";
import "./general.css";

const Typewriter = ({
  mainText,
  cycleWords,
  typingDelay,
  deletingDelay,
  cycleDelay,
}) => {
  const [currentCycleText, setCurrentCycleText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = cycleWords[cycleIndex];
    if (!isDeleting && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setCurrentCycleText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, typingDelay);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentIndex > 0) {
      const timeout = setTimeout(() => {
        setCurrentCycleText(fullText.slice(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
      }, deletingDelay);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && currentIndex === fullText.length) {
      setTimeout(() => setIsDeleting(true), cycleDelay);
    } else if (isDeleting && currentIndex === 0) {
      setIsDeleting(false);
      const nextCycleIndex = (cycleIndex + 1) % cycleWords.length;
      setCycleIndex(nextCycleIndex);
    }
  }, [
    currentIndex,
    isDeleting,
    typingDelay,
    deletingDelay,
    cycleDelay,
    cycleWords,
    cycleIndex,
  ]);

  return (
    <div className="typewriter-container">
      <span className="main-text sm:text-[16px] md:text-[20px] lg:text-[24px] xl:text-[26px] 2xl:text-[37px] font-ubuntu font-bold text-honeydew-good">
        {mainText}
      </span>
      <span className="cycle-text sm:text-[16px] md:text-[20px] lg:text-[24px] xl:text-[26px] 2xl:text-[37px] font-ubuntu font-bold text-blue-mainpagebeforeLogin">
        {currentCycleText}
      </span>
    </div>
  );
};

export default Typewriter;
