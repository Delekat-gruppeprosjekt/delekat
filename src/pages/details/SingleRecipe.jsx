import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FaHeart } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { BiTime } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { PiChefHat } from "react-icons/pi";

export default function SingleRecipe() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portions, setPortions] = useState(1);

  useEffect(() => {
    const fetchRecipe = async () => {
      const db = getFirestore();
      try {
        const recipeDoc = await getDoc(doc(db, "recipes", recipeId));
        if (recipeDoc.exists()) {
          const data = recipeDoc.data();
          setRecipe(data);
          setPortions(Number(data.portions) || 1);
        } else {
          setError("Recipe not found");
        }
      } catch (err) {
        setError("Error fetching recipe: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handlePortionChange = (newPortions) => {
    if (newPortions >= 1 && newPortions <= 999) {
      setPortions(newPortions);
    }
  };

  const formatQuantity = (value) => {
    const result = value.toFixed(2);
    return result.endsWith(".00") ? parseInt(value) : result;
  };

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/"); // Default to home if no previous page
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="max-w-3xl mx-auto bg-BGwhite rounded-xl shadow p-6">
        <div className="flex flex-col items-center mb-6 relative">
          <button
            onClick={handleBack}
            className="absolute top-0 left-0 px-4 py-2 bg-green-btn text-BGwhite rounded hover:bg-green-btn-hover transition-colors"
          >
            Tilbake
          </button>
          <h1 className="text-3xl font-bold text-center break-words px-4 mt-16 w-full">
            {recipe.title}
          </h1>
        </div>

        <img
          src={recipe.imageUrl || "/assets/avatar_placeholder.png"}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap items-center text-PMgreen gap-2">
            <BiTime className="text-xl flex-shrink-0" />
            <span className="text-lg">{recipe.cookingTime || "10 - 15 min"}</span>
            <div className="flex items-center">
              {[...Array(3)].map((_, index) => (
                <PiChefHat
                  key={index}
                  className={`text-xl mr-1 ${index < (recipe.difficulty === "vanskelig" ? 3 : recipe.difficulty === "medium" ? 2 : 1) ? "text-black-500" : "text-gray-300"}`}
                />
              ))}
              <span className="text-lg capitalize ml-2">
                {recipe.difficulty === "vanskelig" ? "Vanskelig" : 
                 recipe.difficulty === "medium" ? "Medium" : 
                 "Lett"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <FaHeart className="text-xl text-PMgreen" />
              <span className="ml-2 text-lg text-PMgreen">{recipe.likes || 0}</span>
            </div>
            <div className="flex items-center">
              <IoChatbubbleOutline className="text-xl text-PMgreen" />
              <span className="ml-2 text-lg text-PMgreen">{recipe.comments ? recipe.comments.length : 0}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full h-[1px] bg-gray-300 my-6" />

        <p className="text-gray-500 text-lg mb-6 break-words whitespace-pre-wrap">{recipe.description}</p>
        
        <div className="w-full h-[1px] bg-gray-300 my-6" />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Porsjoner</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handlePortionChange(portions - 1)}
              className="px-4 py-2 bg-green-btn rounded hover:bg-green-btn-hover text-BGwhite transition-colors"
            >
              -
            </button>
            <span className="text-xl font-semibold">{portions}</span>
            <button
              onClick={() => handlePortionChange(portions + 1)}
              disabled={portions >= 999}
              className={`px-4 py-2 bg-green-btn rounded hover:bg-green-btn-hover text-BGwhite transition-colors ${
                portions >= 999 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              +
            </button>
          </div>
        </div>
        

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ingredienser</h2>
          <ul className="list-disc list-inside mb-4">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="break-words">
                {formatQuantity(ing.amount * (portions / recipe.portions))} {ing.unit} {ing.ingredient}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-full h-[1px] bg-gray-200 my-6" />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Instruksjoner</h2>
          <ol className="list-decimal list-inside">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="mb-2 break-words whitespace-pre-wrap">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}