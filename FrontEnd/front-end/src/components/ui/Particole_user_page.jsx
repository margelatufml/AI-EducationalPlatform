import React from "react";
import Particles from "react-tsparticles";
import "./general.css";

const ParticleBackground = () => {
  const particlesOptions = {
    fpsLimit: 60,
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      opacity: {
        value: 0.5,
        anim: {
          enable: true,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 20,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
    },
    detectRetina: true,
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1]">
      <Particles
        options={particlesOptions}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default ParticleBackground;
