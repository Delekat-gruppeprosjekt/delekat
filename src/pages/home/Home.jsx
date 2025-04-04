import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HomeCard from "../../components/home/HomeCard2.jsx";
import { PiMagnifyingGlass, PiX, PiSignOutLight } from "react-icons/pi";
import { useAuth } from "../../contexts/authContext/auth.jsx";
import { firestore } from "../../../firebase";
import { getDocs, collection, query, orderBy, limit, startAfter } from "@firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

// SPINNER-KOMPONENTER FRA PETRINE-SPINNER2
import Spinner2Burger from "../../components/spinner/Spinner2Burger.jsx";
import HomeGame from "../../components/spinner/HomeGame.jsx";

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [oppskrifter, setOppskrifter] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1280);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const observerRef = useRef(null);

  // Viser/spiller kun hvis localStorage-flagget IKKE er satt
  const [showGame, setShowGame] = useState(() => localStorage.getItem("homeGameClosed") !== "true");

  const fetchRecipes = async (isInitialLoad = false) => {
    if (isLoading || (!hasMore && !isInitialLoad)) return;
    setIsLoading(true);
    try {
      let q;
      if (isInitialLoad) {
        q = query(collection(firestore, "recipes"), orderBy("createdAt", "desc"), limit(24));
      } else {
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
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setOppskrifter((prev) => (isInitialLoad ? recipes : [...prev, ...recipes]));
        setHasMore(snapshot.docs.length === 24);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(true);
  }, []);

  // Intersection-observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchRecipes();
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  // Klikk utenfor search => lukker
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isSearchExpanded &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        if (!searchQuery) {
          setIsSearchExpanded(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchExpanded, searchQuery]);

  // Fokus på søkeinput når ekspandert
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Lytter på resize for å bestemme mobil/desktop
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1280);
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
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const filteredRecipes = oppskrifter.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery)
  );

  // Laster?
  // - mobil => Spinner2Burger
  // - desktop => "Loading..."
  if (isLoading) {
    return isSmallScreen ? <Spinner2Burger /> : <div className="flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-BGcolor">
      {/* Viser HomeGame hvis showGame er true */}
      {showGame && <HomeGame onFinish={() => setShowGame(false)} />}

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

      <div className="absolute right-0 top-0 m-8 flex items-center space-x-4">
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

        {currentUser && isSmallScreen && (
          <button
            onClick={handleLogout}
            className="text-xl flex gap-2 items-center hover:scale-110 hover:text-red-btn-hover duration-150 cursor-pointer"
          >
            <PiSignOutLight /> Logg ut
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="w-full text-center text-sm text-gray-600 mt-2 mb-4">
          {filteredRecipes.length === 0
            ? "Ingen oppskrifter funnet"
            : `${filteredRecipes.length} oppskrift${filteredRecipes.length !== 1 ? "er" : ""} funnet`}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4">
        {filteredRecipes.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Ingen oppskrifter funnet. Prøv et annet søk.</p>
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

