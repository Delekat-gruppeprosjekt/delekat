import React from "react";
import HomeList from "../src/components/home/HomeList.jsx";



export default function Home() {
  return (
    <div className="min-h-screen p-6 bg-[var(--color-BGcolor)]">
      <div className="flex items-center justify-start ml-1">
        <img
          src="/assets/DelekatLogo.svg"
          alt="Delekat Logo"
          
        loading="lazy"
        className="h-auto w-22"
        />
      </div>
      <h1 className="text-3xl font-thin mb-6 flex justify-center mt-8">
        La deg friste
      </h1>
      <HomeList />
    </div>
  );
}
