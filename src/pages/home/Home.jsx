import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HomeCard from "../../components/home/HomeCard2.jsx";
import { PiMagnifyingGlass, PiX } from "react-icons/pi";
import { useAuth } from "../../contexts/authContext/auth.jsx";
import { firestore } from "../../../firebase";
import { getDocs, collection } from "@firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

export default function Home() {
  const { currentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [oppskrifter, setOppskrifter] = useState([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const ref = collection(firestore, "recipes");
        const snapshot = await getDocs(ref);
        const recipes = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          authorAvatarUrl: doc.data().authorAvatarUrl || "", // Ensure avatar URL is included
        }));
        // Sort recipes by createdAt timestamp in descending order (newest first)
        const sortedRecipes = recipes.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB - dateA;
        });
        setOppskrifter(sortedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  // Handle clicks outside of the search input to collapse it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isSearchExpanded &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        // Only collapse if there's no text in the search
        if (!searchQuery) {
          setIsSearchExpanded(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded, searchQuery]);

  // Focus the input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleLogout = async () => {
    const auth = getAuth(); // Get Firebase Auth instance
    try {
      await signOut(auth); // Sign the user out
      localStorage.clear(); // Clear localStorage
      navigate("/"); // Navigate to home page after logout
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  // Filter recipes by title 
  const filteredRecipes = oppskrifter.filter((recipe) => 
    recipe.title.toLowerCase().includes(searchQuery)
  );

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

      {/* Search and Logout Buttons */}
      <div className="absolute right-0 top-0 m-8 flex items-center space-x-4">
        {/* Expandable Search Bar */}
        <div className="relative flex items-center" ref={searchInputRef}>
          <div
            className={`flex items-center transition-all duration-300 ease-in-out ${
              isSearchExpanded ? "w-56" : "w-8"
            } overflow-hidden`}
          >
            <input
              type="text"
              className={`bg-BGwhite border border-gray-200 rounded-full py-2 px-3 pl-9 outline-none transition-all duration-300 ${
                isSearchExpanded ? "w-full opacity-100" : "w-0 opacity-0"
              }`}
              placeholder="Søk"
              value={searchQuery}
              onChange={handleSearch}
            />
            <div 
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 z-10 ${
                isSearchExpanded ? "text-xl" : "text-2xl hover:scale-110"
              }`}
              onClick={() => setIsSearchExpanded(true)}
            >
              <PiMagnifyingGlass />
            </div>
            {searchQuery && isSearchExpanded && (
              <div 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={clearSearch}
              >
                <PiX size={18} />
              </div>
            )}
          </div>
        </div>

        {/* Logg ut button only shows if user is logged in */}
        {currentUser && (
          <button
            onClick={handleLogout}
            className="text-lg font-semibold text-red-500 hover:text-red-600"
          >
            Logg ut
          </button>
        )}
      </div>

      {/* Search results count - only shown when there's a search query */}
      {searchQuery && (
        <div className="w-full text-center text-sm text-gray-600 mt-2 mb-4">
          {filteredRecipes.length === 0 
            ? "Ingen oppskrifter funnet" 
            : `${filteredRecipes.length} oppskrift${filteredRecipes.length !== 1 ? 'er' : ''} funnet`
          }
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4">
        {/* Display Recipes Using HomeCard */}
        {filteredRecipes.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Ingen oppskrifter funnet. Prøv et annet søk.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {filteredRecipes.map((recipe) => (
              <HomeCard key={recipe.id} post={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
