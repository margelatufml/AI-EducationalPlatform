import React, { useEffect, useState } from "react";
import "./RippleBackground.css";

const Ripple = () => {
  const size = Math.random() * 5 + 2;
  const top = Math.random() * (100 - size);
  const left = Math.random() * (100 - size);

  const style = `ripple-circle`;
  return (
    <div
      className={style}
      style={{
        top: `${top}vh`,
        left: `${left}vw`,
        width: `${size}vw`,
        height: `${size}vw`,
      }}
    />
  );
};

const RippleBackground = () => {
  const [ripples, setRipples] = useState([]);
  const maxRipples = 20;

  useEffect(() => {
    const initialRipplesCount = 10;
    const addRipple = () => {
      setRipples((currentRipples) => {
        if (currentRipples.length >= maxRipples) {
          return [...currentRipples.slice(1), <Ripple key={Math.random()} />];
        }
        return [...currentRipples, <Ripple key={Math.random()} />];
      });
    };

    for (let i = 0; i < initialRipplesCount; i++) {
      addRipple();
    }

    const intervalId = setInterval(addRipple, 4000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">{ripples}</div>
    </div>
  );
};

export default RippleBackground;
