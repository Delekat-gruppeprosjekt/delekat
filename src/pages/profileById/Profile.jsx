import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../../../firebase";
import { getDocs, collection, query, where } from "@firebase/firestore";

export default function Profile() {
  const { authorId } = useParams(); // Get the author ID from the URL
  const [authorRecipes, setAuthorRecipes] = useState([]);
  const [authorName, setAuthorName] = useState("");

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
      <h1 className="text-3xl font-bold mb-6">{authorName}'s Profile</h1>
      
      <h2 className="text-xl font-semibold mb-4">Recipes by {authorName}:</h2>
      <ul>
        {authorRecipes.map((recipe) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
}
