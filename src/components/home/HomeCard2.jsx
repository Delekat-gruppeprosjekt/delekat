import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { IoChatbubbleOutline } from "react-icons/io5";
import { PiChefHat } from "react-icons/pi";
import { BiTime } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

export default function HomeCard({ post }) {
  console.log('Post data received:', post);
  console.log('Initial portions from post:', post.portions);
  console.log('Post portions type:', typeof post.portions);
  
  const [portions, setPortions] = useState(Number(post.portions) || 1);
  
  console.log('Portions state after initialization:', portions);
  console.log('Portions state type:', typeof portions);
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
    if (newPortions >= 1) {
      setPortions(newPortions);
    }
  };

  const formatQuantity = (value) => {
    const result = value.toFixed(2);
    return result.endsWith('.00') ? parseInt(value) : result;
  };

  const truncateDescription = (text, maxLength = 400) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="w-4/5 mx-auto p-4 bg-white rounded-xl shadow mb-8 flex flex-col relative">
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
            {[...Array(3)].map((_, index) => (
              <PiChefHat 
                key={index}
                className={`text-xl mr-1 -mt-2 ${index < (post.difficulty === "vanskelig" ? 3 : post.difficulty === "medium" ? 2 : 1) ? "text-black" : "text-gray-300"}`}
              />
            ))}
            <span className="ml-2 capitalize">
              {post.difficulty === "vanskelig" ? "Vanskelig" : 
               post.difficulty === "medium" ? "Medium" : 
               "Lett"}
            </span>
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
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{post.title}</h1>
            <div className="flex items-center text-[#3C5A3C]">
              <BiTime className="text-xl mr-2" />
              <span className="text-lg">{post.cookingTime || "10 - 15 min"}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-[#3C5A3C]">
            <div className="flex items-center">
              <FaHeart className="text-xl" />
              <span className="ml-2 text-lg">{post.likes || 0}K</span>
            </div>
            <div className="flex items-center">
              <IoChatbubbleOutline className="text-xl" />
              <span className="ml-2 text-lg">{post.comments ? post.comments.length : 0}K</span>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-200 my-6" />
        
        <p className="text-gray-700 text-lg">
          {expanded ? post.description : truncateDescription(post.description)}
        </p>

        <div className="w-full h-[1px] bg-gray-200 my-6" />
      </div>
      
      {/* Show these sections only when expanded with slide animation */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden mb-16"
          >
            <div className="mb-8">
              <h2 className="text-center text-2xl font-semibold mb-4">Porsjoner</h2>
              <div className="flex items-center justify-center space-x-6">
                <button 
                  type="button"
                  onClick={() => handlePortionChange(portions - 1)}
                  className="w-12 h-12 rounded-full border-2 border-[#3C5A3C] flex items-center justify-center text-[#3C5A3C] text-2xl hover:bg-[#3C5A3C] hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="text-2xl w-8 text-center">{portions}</span>
                <button 
                  type="button"
                  onClick={() => handlePortionChange(portions + 1)}
                  className="w-12 h-12 rounded-full border-2 border-[#3C5A3C] flex items-center justify-center text-[#3C5A3C] text-2xl hover:bg-[#3C5A3C] hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-200 my-6" />

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Ingredienser</h2>
              <ul className="space-y-4">
                {post.ingredients.map((ing, index) => (
                  <li key={`${ing.ingredient}-${index}`} className="flex items-center text-lg">
                    <span className="w-32 text-black font-regular mr-4">
                      {formatQuantity(ing.amount * (portions / (Number(post.portions) || 1)))} {ing.unit}
                    </span>
                    <span>{ing.ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full h-[1px] bg-gray-200 my-6" />

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Slik gjør du</h2>
              <ol className="list-decimal list-inside space-y-4">
                {post.instructions.map((step, index) => (
                  <li key={index} className="text-lg pl-2">{step}</li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer button - always at the bottom */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full py-3 rounded-full shadow-md transition-colors duration-200 ${
            expanded 
            ? "bg-[#2C432C] text-white" 
            : "bg-[#3C5A3C] text-white hover:bg-[#2C432C]"
          }`}
        >
          {expanded ? "Skjul Oppskrift" : "Les Oppskrift"}
        </button>
      </div>
    </div>
  );
}
