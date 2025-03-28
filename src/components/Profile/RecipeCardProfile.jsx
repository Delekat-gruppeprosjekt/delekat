import React from "react";
import { FaClock, FaRegComment, FaHeart } from "react-icons/fa";
import { PiChefHat } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

export default function RecipeCard({ recipe, onEdit, onDelete }) {
  const navigate = useNavigate();
  const db = getFirestore();

  const handleEdit = () => {
    navigate(`/edit/${recipe.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await deleteDoc(doc(db, "recipes", recipe.id));
        if (onDelete) onDelete(recipe.id);
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  return (
    <li className="relative bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative h-0 pb-[70%]">
        <img
          src={recipe.imageUrl || "/assets/avatar_placeholder.png"}
          alt={recipe.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="p-3">
        {/* Recipe title and description */}
        <h3 className="text-lg font-semibold mb-1">
          {recipe.title || "Recipe Title"}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {recipe.description ||
            "This is a placeholder description for the recipe."}
        </p>
        
        {/* Recipe metadata with time/difficulty on left, comments/favorites on right */}
        <div className="flex justify-between items-start text-sm text-gray-500">
          {/* Left side - Time and Difficulty stacked vertically */}
          <div className="flex flex-col gap-1.5">
            {/* Time */}
            <div className="flex items-center gap-1 text-[#3C5A3C]">
              <FaClock className="text-base flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">
                {recipe.cookingTime || "10 - 15 min"}
              </span>
            </div>
            
            {/* Difficulty */}
            <div className="flex items-center gap-1 text-[#3C5A3C]">
              {[...Array(3)].map((_, index) => (
                <PiChefHat
                  key={index}
                  className={`text-base flex-shrink-0 ${
                    index <
                    (recipe.difficulty === "vanskelig"
                      ? 3
                      : recipe.difficulty === "medium"
                      ? 2
                      : 1)
                      ? "text-black"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 capitalize text-xs">
                {recipe.difficulty === "vanskelig"
                  ? "Vanskelig"
                  : recipe.difficulty === "medium"
                  ? "Medium"
                  : "Lett"}
              </span>
            </div>
          </div>
          
          {/* Right side - Comments and Favorites stacked vertically */}
          <div className="flex flex-col items-end gap-1.5">
            {/* Comments */}
            <div className="flex items-center gap-1 text-[#3C5A3C]">
              <span className="text-xs">{recipe.comments || 0}</span>
              <FaRegComment className="text-base flex-shrink-0" />
            </div>
            
            {/* Favorites */}
            <div className="flex items-center gap-1 text-[#3C5A3C]">
              <span className="text-xs">{recipe.favorites || 0}</span>
              <FaHeart className="text-base flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
      
      {onEdit && onDelete && (
        <div className="flex gap-2 mb-3 mx-3">
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
