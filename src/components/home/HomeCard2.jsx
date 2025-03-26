// Modify HomeCard.jsx to add a link to the profile page

import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaHeart } from 'react-icons/fa';
import { IoChatbubbleOutline } from "react-icons/io5";
import { PiChefHat } from "react-icons/pi";
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

import { getFirestore, doc, getDoc } from "firebase/firestore";  // Import Firestore methods

export default function HomeCard({ post }) {
  const [portions, setPortions] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [author, setAuthor] = useState(null);  // State to store the author data
  const [isLoading, setIsLoading] = useState(true);  // State to manage loading state
  const [error, setError] = useState(null);  // State to handle errors

  const db = getFirestore();  // Initialize Firestore

  // Fetch user data from Firestore based on userId in the post
  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);  // Get user document reference by userId
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setAuthor(userDocSnap.data());  // Set the user data to the state
      } else {
        setError("User not found!");
      }
    } catch (err) {
      setError("Error fetching user data: " + err.message);
    } finally {
      setIsLoading(false);  // Set loading state to false once data is fetched
    }
  };

  useEffect(() => {
    if (post.userId) {
      fetchUserData(post.userId);  // Fetch the user data when post.userId is available
    }
  }, [post.userId]);

  const handlePortionChange = (newPortions) => {
    setPortions(newPortions);
  };

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const formatQuantity = (value) => {
    const result = value.toFixed(2);
    return result.endsWith('.00') ? parseInt(value) : result;
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-xl shadow mb-8 flex flex-col">
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
              onError={(e) => e.target.src = "/assets/avatar_placeholder.png"} // Fallback avatar
            />
          ) : (
            <img
              src="/assets/avatar_placeholder.png" // Default avatar image
              alt="Default Avatar"
              className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-300"
            />
          )
        )}

        <div className="flex items-center justify-between w-full">
          {/* Make the author's name a clickable link */}
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
            className="w-full h-60 object-cover"
          />
        ) : (
          <div className="w-full h-50 bg-gray-300 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">Placeholder Image</span>
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
              <span>{post.likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <IoChatbubbleOutline />
              <span>{post.comments ? post.comments.length : 0}</span>
            </span>
          </div>
        </div>
        <p className="mt-2 text-gray-600">{post.description}</p>
      </div>
      
      {/* Ingredients */}
      {post.ingredients && post.ingredients.length > 0 && (
        <div className="mb-4">
          <h3 className="font-light text-lg mb-2">Ingredienser</h3>
          <ul className="list-none text-sm space-y-3 text-gray-600 flex flex-col">
            {post.ingredients.map((ing, index) => (
              <li key={`${ing.ingredient}-${index}`} className="flex items-center whitespace-nowrap">
                <span className="w-20 text-black font-regular mr-2">
                  {formatQuantity(ing.value * portions)} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
