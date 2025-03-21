import React from "react";
import HomeList from "../../components/home/HomeList.jsx";
import { PiMagnifyingGlass } from "react-icons/pi";



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
    
      <div className="absolute right-0 top-0 m-8 text-2xl hover:scale-110 duration-150 cursor-pointer"><PiMagnifyingGlass /></div>
      <HomeList />
    </div>
  );
}