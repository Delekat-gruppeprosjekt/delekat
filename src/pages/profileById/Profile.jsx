import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../../../firebase";
import { getDocs, collection, query, where } from "@firebase/firestore";
import RecipeCard from "../../components/profile/RecipeCard";

export default function Profile() {
  const { authorId } = useParams(); // Get the author ID from the URL
  const [authorRecipes, setAuthorRecipes] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/assets/avatar_placeholder.png");

  useEffect(() => {
    const fetchAuthorRecipes = async () => {
      try {
        const ref = collection(firestore, "recipes");
        const q = query(ref, where("userId", "==", authorId));
        const snapshot = await getDocs(q);
        const recipes = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        if (recipes.length > 0) {
          setAuthorName(recipes[0].author); // Get author name from one of their recipes
        }
        setAuthorRecipes(recipes);
      } catch (error) {
        console.error("Error fetching author's recipes:", error);
      }
    };

    fetchAuthorRecipes();
  }, [authorId]);

  return (
    <div className="min-h-screen p-6 bg-[var(--color-BGcolor)]">
      <div className="flex flex-col justify-center items-center my-16">
        <img
          className="w-48 rounded-full border-BGwhite border-4 mb-4"
          src={avatarUrl}
          alt="User Avatar"
        />
        <h1 className="text-2xl font-black">{authorName}</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Oppskrifter av {authorName}
        </h2>
        {authorRecipes.length === 0 ? (
          <p className="text-center text-gray-500">
            This user has no recipes yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
