import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SimpleCarousel from "../components/ui/Carousel/Carousel";
import OTTERIMAGE from "../components/ui/Carousel/images/OTTER.png";
import Otter_Trophee from "../components/ui/Carousel/images/imagine-1.png";
import Otter_Books from "../components/ui/Carousel/images/imagine-2.png";

function MainPageBeforLogIn() {
  const circleRef = useRef(null);
  const sectionRef = useRef(null);
  const boxRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const circle = circleRef.current;
      const section = sectionRef.current;
      if (circle && section) {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          circle.style.opacity = "1";
          const scrollPosition = window.scrollY + windowHeight / 2 - 10;
          circle.style.transform = `translateY(${
            scrollPosition - section.offsetTop
          }px)`;

          boxRefs.current.forEach((box) => {
            if (box) {
              box.style.background = ""; // Reset any inline styles
            }
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-gunmetal-blue">
      <div className="relative mt-8">
        <div className="relative w-screen h-14 z-10 flex flex-row justify-end pl-8 p-11 pt-10">
          <Link to="/LoginPage">
            <button className="btn text-black mr-7 pl-5 pr-5 bg-blue-mainpagebeforeLogin hover:bg-airforce-princeton">
              LogIn
            </button>
          </Link>
          <Link to="/RegisterPage">
            <button className="btn text-black ml-4 pl-5 pr-5 bg-blue-mainpagebeforeLogin hover:bg-airforce-princeton">
              SignUp
            </button>
          </Link>
        </div>
      </div>
      <SimpleCarousel />
      <div
        ref={sectionRef}
        className="relative flex flex-col mt-20 px-20 space-y-20"
      >
        {[
          {
            id: "text1",
            text: "Transformă învățarea într-o competiție cu prietenii. Compară-ți rezultatele exercițiilor cu ale celorlalți și provocați-vă reciproc pentru a vă îmbunătăți performanțele. ",
            imageUrl: Otter_Trophee,
          },
          {
            id: "text2",
            text: "Rezolvă exerciții explicate și corectate pe placul tău. Intelecta oferă detalii clare și explicite pentru fiecare exercițiu, ajutându-te să înțelegi concepte complexe și să aplici cunoștințele dobândite.",
            imageUrl: Otter_Books,
          },
          {
            id: "text3",
            text: "Învață mai ușor cu Intelecta! Folosim un model propriu de inteligență artificială care ajustează exercițiile și materialele educaționale în funcție de nivelul și stilul fiecărui elev.",
            imageUrl: OTTERIMAGE,
          },
        ].map((content, index) => (
          <div
            key={content.id}
            className={`flex ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            } w-full items-center space-y-20 md:space-y-0 md:space-x-20 `}
          >
            <div
              ref={(el) => (boxRefs.current[index] = el)}
              className="w-full md:w-1/2 p-10 bg-transparent text-blue-mainpagebeforeLogin text-xl rounded-lg shadow-md shadow-blue-mainpagebeforeLogin "
            >
              {content.text}
            </div>
            <div className="w-full md:w-5/10 flex justify-center ">
              <div className="w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={content.imageUrl}
                  alt={`Illustration for ${content.text}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPageBeforLogIn;
