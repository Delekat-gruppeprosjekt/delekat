import React from "react";

export default function Logo() {
  return (
    <div className={`flex items-center justify-start ml-1 `}>
      <img
        src="/Delekat-Logo.svg"
        alt="Delekat Logo"
        loading="lazy"
        className={`h-auto w-22 `}
      />
    </div>
  );
}
