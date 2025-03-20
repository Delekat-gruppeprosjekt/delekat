import React, { useState } from "react";
import HomeList from "../../components/home/HomeList.jsx";
import { PiMagnifyingGlass } from "react-icons/pi";

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };


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
      <div 
        className="absolute right-0 top-0 m-8 text-2xl hover:scale-110 duration-150 cursor-pointer"
        onClick={() => setShowSearch(!showSearch)}
      >
        <PiMagnifyingGlass />
      </div>
      {showSearch && (
        <div className="flex justify-center">
          <input 
            className="bg-navbar w-2/4 p-2 rounded-lg mb-6 outline-0" 
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Søk"
          />
        </div>
      )}
      <HomeList searchQuery={searchQuery} />
    </div>
  );
}
