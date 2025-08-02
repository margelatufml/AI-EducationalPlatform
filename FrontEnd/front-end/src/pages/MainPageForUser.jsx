import React, { useEffect, useRef } from "react";
import Typewriter from "../components/ui/Typewritter_animation";
import OtterCloseMouth from "../components/ui/otter_animations/otter_circle_close_mouth/index";
import RippleBackground from "../components/ui/background_animations/ripple_animation_mainpage_animation";

const MainPageForUser = () => {
  const mainText = "Invata in cel mai ";
  const cycleWords = [
    " rapid si eficient mod!",
    " modern si interactiv mod!",
    " distractiv si inovativ trend!",
  ];
  const typingDelay = 120;
  const deletingDelay = 120;
  const cycleDelay = 2000;

  const arrowRef = useRef(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const handleArrowVisibility = () => {
      const arrow = arrowRef.current;
      if (arrow) {
        const rect = arrow.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const threshold = windowHeight * 0.65;
        const arrowOpacity = Math.max(
          0,
          Math.min(1, (rect.bottom - threshold) / (windowHeight * 0.35))
        );
        arrow.style.opacity = arrowOpacity;
      }
    };

    const handleScrollEvent = () => {
      hasScrolled.current = true;
      if (arrowRef.current) {
        arrowRef.current.classList.remove("animate-flicker");
      }
    };

    window.addEventListener("scroll", handleArrowVisibility);
    window.addEventListener("scroll", handleScrollEvent);

    const flickerTimeout = setTimeout(() => {
      if (!hasScrolled.current && arrowRef.current) {
        arrowRef.current.classList.add("animate-flicker");
      }
    }, 3000);

    return () => {
      window.removeEventListener("scroll", handleArrowVisibility);
      window.removeEventListener("scroll", handleScrollEvent);
      clearTimeout(flickerTimeout);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative min-h-screen overflow-hidden">
        <div className="parallax-bg"></div>
        <RippleBackground />
        <div className="z-10 relative flex flex-col items-center pt-10">
          <div className="flex justify-center items-center mb-20 text-airforce-blue">
            <Typewriter
              mainText={mainText}
              cycleWords={cycleWords}
              typingDelay={typingDelay}
              deletingDelay={deletingDelay}
              cycleDelay={cycleDelay}
            />
          </div>
          <div className="flex justify-center mb-20 transform">
            <OtterCloseMouth />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-12 md:space-y-0">
          <span className="text-2xl font-bold text-blue-mainpagebeforeLogin mr-4">
            Descoperă Intelecta
          </span>
          <svg
            ref={arrowRef}
            data-name="1-Arrow Up"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-10 h-30 fill-current text-blue-mainpagebeforeLogin rotate-180"
          >
            <path d="m26.71 10.29-10-10a1 1 0 0 0-1.41 0l-10 10 1.41 1.41L15 3.41V32h2V3.41l8.29 8.29z" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-20">
        <h2 className="text-3xl font-bold text-kindofwhite mb-10">
          Ce este Intelecta?
        </h2>
        <div className="flex flex-col items-center space-y-10 md:space-y-0">
          <p className="text-center text-lg max-w-xl text-airforce-blue p-5 bg-transparent rounded-lg shadow-xl shadow-blue-mainpagebeforeLogin">
            Folosind tehnologia AI, Intelecta ajută elevii de liceu din România
            să învețe mai eficient și să se pregătească mai bine pentru examene.
            Platforma noastră oferă o experiență de studiu interactivă și
            adaptată fiecărui elev, astfel încât aceștia să poată învăța într-un
            mod plăcut, fără stres, și să-și atingă obiectivele academice cu
            ușurință.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-44">
        <h2 className="text-3xl font-bold text-kindofwhite mb-10">
          Povestea Intelecta
        </h2>
        <div className="w-full max-w-4xl p-5 bg-prussian-blue rounded-lg shadow-lg">
          <div className="video-wrapper w-full h-full">
            {/* <iframe
              className="w-full rounded-lg shadow-lg"
              width="500"
              height="500"
              src="https://www.youtube.com/embed/uAJcv_NN5V0?si=r_VmL08V3fpfWwBw"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe> */}
          </div>
        </div>
      </div>

      {/* <Slideshow /> */}
    </div>
  );
};

export default MainPageForUser;
