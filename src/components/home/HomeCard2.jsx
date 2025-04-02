import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegComment, FaClock } from 'react-icons/fa';
import { PiChefHat } from "react-icons/pi";
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function HomeCard({ post }) {
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const db = getFirestore();

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

  return (
    <div
      onClick={() => navigate(`/recipe/${post.id}`)}
      className="relative bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {/* User Info at top */}
      <div className="flex items-center p-3">
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

        <div className="flex-grow">
          {isLoading ? (
            <div className="w-1/2 h-4 bg-gray-300 animate-pulse" />
          ) : (
            <Link 
              to={`/profile/${post.userId}`} 
              className="font-medium text-blue-btn hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {author?.displayName || 'Anonym'}
            </Link>
          )}
        </div>
      </div>

      {/* Image with aspect ratio like profile card */}
      <div className="relative h-0 pb-[70%]">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Ingen bilde tilgjengelig</span>
          </div>
        )}
      </div>
      
      {/* Content section */}
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {post.description || "Dette er en plassholderbeskrivelse for oppskriften."}
        </p>
        
        {/* Stats section - similar to profile card */}
        <div className="flex justify-between items-start text-sm text-gray-500">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1 text-PMgreen">
              <FaClock className="text-base flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{post.cookingTime || "10 - 15 min"}</span>
            </div>
            <div className="flex items-center gap-1 text-PMgreen">
              {[...Array(3)].map((_, index) => (
                <PiChefHat
                  key={index}
                  className={`text-base flex-shrink-0 ${
                    index < (post.difficulty === "vanskelig" ? 3 : post.difficulty === "medium" ? 2 : 1)
                      ? "text-black"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 capitalize text-xs">
                {post.difficulty === "vanskelig" ? "Vanskelig" : post.difficulty === "medium" ? "Medium" : "Lett"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1 text-PMgreen">
              <span className="text-xs">{post.comments ? post.comments.length : 0}</span>
              <FaRegComment className="text-base flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1 text-PMgreen">
              <span className="text-xs">{post.likes || 0}</span>
              <FaHeart className="text-base flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
