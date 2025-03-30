import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { IoChatbubbleOutline } from "react-icons/io5";
import { PiChefHat } from "react-icons/pi";
import { BiTime } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeCard({ post, isExpanded, onExpand }) {
  const [portions, setPortions] = useState(parseInt(post.portions) || 1);
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

  // Reset portions when card is expanded/collapsed
  useEffect(() => {
    if (!isExpanded) {
      setPortions(parseInt(post.portions) || 1);
    }
  }, [isExpanded, post.portions]);

  const handlePortionChange = (newPortions) => {
    if (newPortions >= 1) {
      setPortions(newPortions);
    }
  };

  const formatQuantity = (value) => {
    const result = value.toFixed(2);
    return result.endsWith('.00') ? parseInt(value) : result;
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <>
      {/* Preview Card */}
      <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-lg mb-8 flex flex-col relative">
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
              className="w-full h-56 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-56 bg-gray-300 flex items-center justify-center rounded-lg">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>

        {/* Post Info with title and icons */}
        <div className="mb-16">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <h1 className="text-xl font-semibold break-words">{post.title}</h1>
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

          <div className="w-full h-[1px] bg-gray-200 my-4" />
          
          <p className="text-gray-700 text-base break-words">
            {truncateDescription(post.description)}
          </p>
        </div>

        {/* Footer button - always at the bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onExpand();
            }}
            className="w-full py-3 rounded-full shadow-md transition-colors duration-200 bg-[#3C5A3C] text-white hover:bg-[#2C432C]"
          >
            Les Oppskrift
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 pb-20 xl:pb-4 xl:left-[100px] xl:w-[calc(100%-100px)]"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand();
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal content */}
              <div className="p-6">
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

                {/* Image */}
                <div className="mb-6">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded-lg">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                </div>

                {/* Title and metadata */}
                <div className="mb-6">
                  <h1 className="text-3xl font-semibold mb-4 break-words">{post.title}</h1>
                  <div className="flex items-center justify-between text-[#3C5A3C]">
                    <div className="flex items-center">
                      <BiTime className="text-xl mr-2" />
                      <span className="text-lg">{post.cookingTime || "10 - 15 min"}</span>
                    </div>
                    <div className="flex items-center space-x-6">
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
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Beskrivelse</h2>
                  <p className="text-gray-700 text-lg break-words whitespace-pre-wrap">
                    {post.description}
                  </p>
                </div>

                {/* Portions */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Porsjoner</h2>
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

                {/* Ingredients */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Ingredienser</h2>
                  <ul className="space-y-4">
                    {post.ingredients.map((ing, index) => (
                      <li key={`${ing.ingredient}-${index}`} className="flex items-center text-lg break-words">
                        <span className="w-32 text-black font-regular mr-4 shrink-0">
                          {formatQuantity(ing.amount * (portions / (Number(post.portions) || 1)))} {ing.unit}
                        </span>
                        <span className="break-words">{ing.ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Slik gjør du</h2>
                  <ol className="list-decimal list-inside space-y-4">
                    {post.instructions.map((step, index) => (
                      <li key={index} className="text-lg pl-2 break-words whitespace-pre-wrap">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
