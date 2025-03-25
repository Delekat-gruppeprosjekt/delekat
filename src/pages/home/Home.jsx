import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import HomeList from "../../components/home/HomeList.jsx";
import { PiMagnifyingGlass } from "react-icons/pi";
import { useAuth } from "../../contexts/authContext/auth.jsx";
import { firestore } from "../../../firebase";
import { getDocs, collection } from "@firebase/firestore";

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Initialize navigation
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [oppskrifter, setOppskrifter] = useState([]);

  // Fetch recipes from Firestore
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const ref = collection(firestore, "recipes");
        const snapshot = await getDocs(ref);
        const recipes = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setOppskrifter(recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleAuthorClick = (authorId) => {
    navigate(`/profile/${authorId}`);
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

      {/* List of Recipes */}
      <ul className="mt-6">
        {oppskrifter
          .filter((recipe) => recipe.title.toLowerCase().includes(searchQuery))
          .map((recipe) => (
            <li
              key={recipe.id}
              className="p-2 border-b border-gray-300 flex flex-col items-center mb-4"
            >
              <h3 className="text-lg font-semibold">{recipe.title}</h3>
              <p>{recipe.description}</p>
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-40 h-40 object-cover mt-2 rounded-lg"
                />
              )}
              <p>
                Created by:{" "}
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => handleAuthorClick(recipe.userId)}
                >
                  {recipe.author}
                </span>
              </p>
            </li>
          ))}
      </ul>

      {/* Search Icon */}
      <div
        className="absolute right-0 top-0 m-8 text-2xl hover:scale-110 duration-150 cursor-pointer"
        onClick={() => setShowSearch(!showSearch)}
      >
        <PiMagnifyingGlass />
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

      {/* Pass searchQuery to HomeList */}
      <HomeList searchQuery={searchQuery} />
    </div>
  );
}
