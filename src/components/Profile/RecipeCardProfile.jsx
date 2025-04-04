import React from "react";
import { FaRegComment, FaHeart, FaClock } from "react-icons/fa";
import { PiChefHat } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

export default function RecipeCardProfile({ recipe, onEdit, onDelete, isAdmin, isOwnProfile }) {
  const navigate = useNavigate();
  const db = getFirestore();

  const handleEdit = () => {
    navigate(`/edit/${recipe.id}`);
  };

  const handleDelete = async () => {
    if (!isAdmin && !isOwnProfile) {
      alert("Du har ikke tillatelse til å slette denne oppskriften.");
      return;
    }
    
    if (window.confirm("Er du sikker på at du vil slette denne oppskriften?")) {
      try {
        await deleteDoc(doc(db, "recipes", recipe.id));
        if (onDelete) onDelete(recipe.id);
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  return (
    <div
    onClick={() => navigate(`/recipe/${recipe.id}`)}
    className="relative bg-BGwhite shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-0 pb-[70%]">
        <img
          src={recipe.imageUrl || "/assets/avatar_placeholder.png"}
          alt={recipe.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-1">{recipe.title || "Oppskrift tittel"}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
          {recipe.description || "Dette er en plassholderbeskrivelse for oppskriften."}
        </p>
        
        <div className="flex justify-between items-start text-sm text-gray-500">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1 text-PMgreen">
              <FaClock className="text-base flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{recipe.cookingTime || "10 - 15 min"}</span>
            </div>
            <div className="flex items-center gap-1 text-PMgreen">
              {[...Array(3)].map((_, index) => (
                <PiChefHat
                  key={index}
                  className={`text-base flex-shrink-0 ${
                    index < (recipe.difficulty === "vanskelig" ? 3 : recipe.difficulty === "medium" ? 2 : 1)
                      ? "text-black-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 capitalize text-xs">
                {recipe.difficulty === "vanskelig" ? "Vanskelig" : recipe.difficulty === "medium" ? "Medium" : "Lett"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1 text-Pmgreen">
              <span className="text-xs">{recipe.comments || 0}</span>
              <FaRegComment className="text-base flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1 text-PMgreen">
              <span className="text-xs">{recipe.favorites || 0}</span>
              <FaHeart className="text-base flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
      
      {(isAdmin || isOwnProfile) && (
        <div className="flex gap-2 mb-3 mx-3">
          {onEdit && (
  <button
    className="bg-green-btn text-BGwhite px-3 py-1 rounded-md hover:bg-green-btn-hover transition"
    onClick={(e) => {
      e.stopPropagation(); // Prevent click event from propagating to the parent element
      handleEdit();
    }}
  >
    Rediger
  </button>
)}

{onDelete && (
  <button
    className="bg-red-btn text-BGwhite px-3 py-1 rounded-md hover:bg-red-btn-hover transition"
    onClick={(e) => {
      e.stopPropagation(); // Prevent click event from propagating to the parent element
      handleDelete();
    }}
  >
    Slett
  </button>
)}

        </div>
      )}
    </div>
  );
}
