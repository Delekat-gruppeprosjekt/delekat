import React from "react";
import spinner2Burger from "./icons/spinner2Burger.svg";
import spinner2hamburgerkjott from "./icons/Spinner2hamburgerkjott.svg";
import spinner2Ost from "./icons/Spinner2Ost.svg";
import spinner2Salat from "./icons/spinner2Salat.svg";

export default function Spinner2Burger() {
  const spinnerImages = [
    spinner2Burger,
    spinner2hamburgerkjott,
    spinner2Ost,
    spinner2Salat,
  ];

  const containerSize = 90;
  const iconSize = 25;
  const radius = containerSize / 2;

  return (
    <div className="min-h-screen flex items-center justify-center bg-BGcolor">
      <style>{`
        @keyframes iconOrbit {
          from {
            transform: rotate(0deg) translateX(${radius}px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(${radius}px) rotate(-360deg);
          }
        }
      `}</style>

      <div
        style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
        className="relative"
      >
        {spinnerImages.map((imgSrc, index) => {
          const delay = -(index * (2 / spinnerImages.length)) + "s";
          const initialAngle = (360 / spinnerImages.length) * index;
          return (
            <img
              key={index}
              src={imgSrc}
              alt="Spinner ikon"
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `rotate(${initialAngle}deg) translateX(${radius}px) rotate(-${initialAngle}deg)`,
                animation: `iconOrbit 2s linear infinite`,
                animationDelay: delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
