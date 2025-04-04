import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HomeCard from "../../components/home/HomeCard2.jsx"; // Import HomeCard
import { PiMagnifyingGlass, PiX } from "react-icons/pi";
import { PiSignOutLight } from "react-icons/pi";
import { useAuth } from "../../contexts/authContext/auth.jsx";
import { firestore } from "../../../firebase";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
} from "@firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useToast } from "../../contexts/toastContext/toast";

export default function Home() {
  const { currentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [oppskrifter, setOppskrifter] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1280);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(
    window.innerWidth < 600
  );
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  // State variables for infinite scrolling functionality
  const [lastVisible, setLastVisible] = useState(null); // Stores the last document reference for pagination
  const [hasMore, setHasMore] = useState(true); // Indicates if there are more posts available to load
  const [isLoading, setIsLoading] = useState(false); // Prevents multiple simultaneous loading requests
  const searchInputRef = useRef(null);
  const observerRef = useRef(null); // Reference for the intersection observer target element
  const { showToast } = useToast();

  // Function to fetch recipes with pagination support
  const fetchRecipes = async (isInitialLoad = false) => {
    // Prevent loading if already in progress or no more posts available
    if (isLoading || (!hasMore && !isInitialLoad)) return;

    setIsLoading(true);
    try {
      let q;
      // Configure query based on whether it's initial load or subsequent load
      if (isInitialLoad) {
        // Initial load: Get first batch of 24 posts
        q = query(
          collection(firestore, "recipes"),
          orderBy("createdAt", "desc"),
          limit(24)
        );
      } else {
        // Subsequent load: Get next batch of 24 posts after the last visible document
        q = query(
          collection(firestore, "recipes"),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(24)
        );
      }

      const snapshot = await getDocs(q);
      const recipes = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        authorAvatarUrl: doc.data().authorAvatarUrl || "",
      }));

      if (recipes.length > 0) {
        // Update pagination state
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        // Append new recipes or replace for initial load
        setOppskrifter((prev) =>
          isInitialLoad ? recipes : [...prev, ...recipes]
        );
        // Check if more posts are available
        setHasMore(snapshot.docs.length === 24);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      showToast("Kunne ikke laste flere oppskrifter", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load of recipes when component mounts
  useEffect(() => {
    fetchRecipes(true);
  }, []);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Load more posts when the observer target becomes visible
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchRecipes();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the target is visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

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

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1280);
      setIsVerySmallScreen(window.innerWidth < 600);
    };

    // Set initial values
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      showToast("Du er nå logget ut", "success");
      navigate("/"); // Navigate to home page after logout
    } catch (err) {
      console.error("Error during logout:", err);
      showToast("Det oppstod en feil ved utlogging", "error");
    }
  };

  // Filter recipes by title
  const filteredRecipes = oppskrifter.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="min-h-screen p-6 bg-BGcolor">
      {/* Header section with logo and logout for small screens */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start ml-1">
          <img
            src="/assets/DelekatLogo.svg"
            alt="Delekat Logo"
            loading="lazy"
            className="h-auto w-22"
          />
        </div>

        {/* Logout button for small screens positioned in top right */}
        {isVerySmallScreen && currentUser && (
          <button
            onClick={handleLogout}
            className="text-base flex gap-1.5 items-center hover:scale-110 hover:text-red-btn-hover duration-150 cursor-pointer p-1.5"
          >
            <PiSignOutLight size={20} /> Logg ut
          </button>
        )}
      </div>

      {/* For very small screens, show a centered search bar */}
      {isVerySmallScreen && (
        <div className="flex justify-center items-center my-4">
          <div className="relative w-3/4">
            <input
              type="text"
              className="w-full bg-BGwhite border border-PMgreen rounded-full py-2 px-4 pl-9 outline-none"
              placeholder="Søk"
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <PiMagnifyingGlass />
            </div>
            {searchQuery && (
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={clearSearch}
              >
                <PiX size={18} />
              </div>
            )}
          </div>
        </div>
      )}

      <h1 className="text-3xl font-thin mb-6 flex justify-center mt-8">
        La deg friste
      </h1>

      {/* Search and Logout Buttons - Only visible for non-very-small screens */}
      {!isVerySmallScreen && (
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
                className={`bg-BGwhite border border-PMgreen rounded-full py-2 px-3 pl-9 outline-none transition-all duration-300 ${
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
          {currentUser && isSmallScreen && (
            <button
              onClick={handleLogout}
              className=" text-xl flex gap-2 items-center hover:scale-110 hover:text-red-btn-hover duration-150 cursor-pointer"
            >
              <PiSignOutLight /> Logg ut
            </button>
          )}
        </div>
      )}

      {/* Search results count - only shown when there's a search query */}
      {searchQuery && (
        <div className="w-full text-center text-sm text-gray-600 mt-2 mb-4">
          {filteredRecipes.length === 0
            ? ""
            : `${filteredRecipes.length} oppskrift${
                filteredRecipes.length !== 1 ? "er" : ""
              } funnet`}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4">
        {filteredRecipes.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Ingen oppskrifter funnet. Prøv et annet søk.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
              {filteredRecipes.map((recipe) => (
                <HomeCard key={recipe.id} post={recipe} />
              ))}
            </div>
            <div ref={observerRef} className="h-10" />
          </>
        )}
      </div>
    </div>
  );
}
