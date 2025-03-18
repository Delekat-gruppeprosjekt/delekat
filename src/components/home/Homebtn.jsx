import React from 'react';
import { SlArrowDownCircle } from "react-icons/sl";

export default function LesMer({ expanded, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  const text =
    typeof expanded === 'boolean'
      ? expanded
        ? "Se mindre"
        : "Les Hele oppskriften"
      : "Les mer";

  return (
    <a
      href="#"
      onClick={handleClick}
      className="w-full font-semibold text-[var(--color-PMgreen)] flex items-center justify-center"
    >
      <span className="mr-2">{text}</span>
      <SlArrowDownCircle size={24}
        className={`text-3xl transition-transform duration-300 transform ${expanded ? 'rotate-180' : ''} hover:scale-110 hover:-translate-y-1 hover:drop-shadow-lg`}
      />
    </a>
  );
}
