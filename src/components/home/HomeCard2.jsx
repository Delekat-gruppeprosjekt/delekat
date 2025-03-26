import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { IoChatbubbleOutline } from "react-icons/io5";
import { PiChefHat } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

export default function HomeCard({ post }) {
  const [portions, setPortions] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore();

  // Fetch user data from Firestore based on userId in the post
  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setAuthor(userDocSnap.data());
      } else {
        setError("User not found!");
      }
    } catch (err) {
      setError("Error fetching user data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (post.userId) {
      fetchUserData(post.userId);
    }
  }, [post.userId]);

  const handlePortionChange = (newPortions) => {
    setPortions(newPortions);
  };

  const formatQuantity = (value) => {
    const result = value.toFixed(2);
    return result.endsWith('.00') ? parseInt(value) : result;
  };

  return (
    <div className="w-4/5 mx-auto p-4 bg-white rounded-xl shadow mb-8 flex flex-col">
      {/* Header with user info and difficulty level */}
      <div className="flex items-center mb-4">
        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse mr-2" />
        ) : (
          author?.avatarUrl ? (
            <img
              src={author.avatarUrl}
              alt={author.displayName || "Anonym"}
              className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-300"
              onError={(e) => e.target.src = "/assets/avatar_placeholder.png"}
            />
          ) : (
            <img
              src="/assets/avatar_placeholder.png"
              alt="Default Avatar"
              className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-300"
            />
          )
        )}

        <div className="flex items-center justify-between w-full">
          {isLoading ? (
            <div className="w-1/2 h-4 bg-gray-300 animate-pulse" />
          ) : (
            <Link to={`/profile/${post.userId}`} className="font-regular text-blue-500 hover:underline">
              {author?.displayName || 'Anonym'}
            </Link>
          )}
          <div className="flex items-center">
            <PiChefHat className="text-xl mr-2 -mt-2" />
            <span>{post.difficulty || "Lett"}</span>
          </div>
        </div>
      </div>
      
      {/* Image or placeholder */}
      <div className="mb-4">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg border-gray-300 border-1"
          />
        ) : (
          <div className="w-full h-50 bg-gray-300 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>

      {/* Post Info with title and icons */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-light">{post.title}</h1>
          <div className="flex space-x-4">
            <span className="flex items-center space-x-1">
              <FaHeart />
              <span>{post.likes || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <IoChatbubbleOutline />
              <span>{post.comments ? post.comments.length : 0}</span>
            </span>
          </div>
        </div>
        <p className="mt-2 text-gray-600">{post.description}</p>
      </div>
      
      {/* Show these sections only when expanded with slide animation */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Ingredients */}
            {post.ingredients && post.ingredients.length > 0 && (
              <div className="mb-4">
                <h3 className="font-light text-lg mb-2">Ingredienser</h3>
                <ul className="list-none text-sm space-y-3 text-gray-600 flex flex-col">
                  {post.ingredients.map((ing, index) => (
                    <li key={`${ing.ingredient}-${index}`} className="flex items-center whitespace-nowrap">
                      <span className="w-20 text-black font-regular mr-2">
                        {formatQuantity(ing.amount * portions)} {ing.unit}
                      </span>
                      <span>{ing.ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructions */}
            {post.instructions && post.instructions.length > 0 && (
              <div className="mb-4">
                <h3 className="font-light text-lg mb-2">Instruksjoner</h3>
                <ol className="list-decimal text-sm space-y-2 text-gray-700 pl-5">
                  {post.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Portion Adjuster */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">Antall porsjoner:</span>
              <input
                type="number"
                value={portions}
                min="1"
                onChange={(e) => handlePortionChange(Number(e.target.value))}
                className="w-16 p-1 border rounded-md text-center"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand Button */}
      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Vis mindre" : "Vis mer"}
      </button>
    </div>
  );
}
