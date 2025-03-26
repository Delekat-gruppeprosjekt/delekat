import React from "react";
import { FaClock, FaRegComment, FaHeart } from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";

export default function RecipeCard({ recipe, onEdit, onDelete }) {
  return (
    <li className="relative bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative h-0 pb-[70%]">
        <img
          src={recipe.imageUrl || "/assets/avatar_placeholder.png"}
          alt={recipe.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <FaClock />
            <span>{recipe.time || "30 mins"}</span>
          </div>
          <div className="flex items-center gap-1">
            <GiChefToque />
            <span>{recipe.difficulty || "Easy"}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {recipe.title || "Recipe Title"}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {recipe.description ||
            "This is a placeholder description for the recipe."}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FaRegComment />
            <span>{recipe.comments || "0 comments"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaHeart />
            <span>{recipe.favorites || "0 favorites"}</span>
          </div>
        </div>
      </div>
      {onEdit && onDelete && (
        <div className="flex gap-2 mt-2 p-4">
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
