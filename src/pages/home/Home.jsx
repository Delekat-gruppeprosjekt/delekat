import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeCard from "../../components/home/HomeCard2.jsx"; // Import HomeCard
import { PiMagnifyingGlass } from "react-icons/pi";
import { useAuth } from "../../contexts/authContext/auth.jsx";
import { firestore } from "../../../firebase";
import { getDocs, collection } from "@firebase/firestore";
import { getAuth, signOut } from "firebase/auth"; // Import signOut from Firebase Auth

import LoaderModal from "../../components/spinner/LoaderModal.jsx";


export default function Home() {
  const { currentUser } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [oppskrifter, setOppskrifter] = useState([]);

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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
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
    
   
      <LoaderModal />
   
      {/* Search and Logout Buttons */}
      <div className="absolute right-0 top-0 m-8 flex space-x-4">
        {/* Magnifying Glass Search Icon */}
        <div
          className="text-2xl hover:scale-110 duration-150 cursor-pointer"
          onClick={() => setShowSearch(!showSearch)}
        >
          <PiMagnifyingGlass />
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


      {/* Search Input */}
      {showSearch && (
        <div className="flex justify-center">
          <input
            className="bg-BGwhite w-2/4 p-2 rounded-lg mb-6 outline-0"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Søk"
          />
        </div>
      )}

<div className="max-w-[1400px] mx-auto px-4">
  {/* Display Recipes Using HomeCard */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
    {oppskrifter
      .filter((recipe) => recipe.title.toLowerCase().includes(searchQuery))
      .map((recipe) => (
        <HomeCard key={recipe.id} post={recipe} />
      ))}
  </div>
</div>


    </div>
  );
}
