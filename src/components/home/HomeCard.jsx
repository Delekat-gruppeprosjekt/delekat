import React, { useState } from 'react';
import { FaUserCircle, FaHeart } from 'react-icons/fa';
import { IoChatbubbleOutline } from "react-icons/io5";
import { PiChefHat } from "react-icons/pi";
import LesMer from "./Homebtn.jsx";
import PortionControl from "./PortionControl.jsx";
import Instructions from './Instructions';
import Comments from './Comments';

export default function HomeCard({ post }) {
  const [portions, setPortions] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const handlePortionChange = (newPortions) => {
    setPortions(newPortions);
  };

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const formatQuantity = (value) => {
    const result = value.toFixed(2);
    return result.endsWith('.00') ? parseInt(value) : result;
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-xl shadow mb-8 flex flex-col">
      {/* Header med brukerinfo og vanskelighetsgrad */}
      <div className="flex items-center mb-4">
        {post.user?.avatarUrl ? (
          <img
            src={post.user.avatarUrl}
            alt={post.user.username}
            className="w-8 h-8 mr-2"
          />
        ) : (
          <FaUserCircle className="text-2xl mr-2" />
        )}
        <div className="flex items-center justify-between w-full">
          <span className="font-regular">{post.user?.username || 'Anonym'}</span>
          <div className="flex items-center">
            <PiChefHat className="text-xl mr-2 -mt-2" />
            <span>{post.difficulty || "Lett"}</span>
          </div>
        </div>
      </div>

      {/* Bilde eller placeholder */}
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

      {/* Post-info med tittel og ikoner */}
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

      {/* Porsjonskontroll */}
      <PortionControl onPortionChange={handlePortionChange} />

      {/* Ingredienser */}
      {post.ingredients && post.ingredients.length > 0 && (
        <div className="mb-4">
          <h3 className="font-light text-lg mb-2">Ingredienser</h3>
          <ul className="list-none text-sm space-y-3 text-gray-600 flex flex-col">
            {post.ingredients.map((ing, index) => (
              <li
                key={`${ing.ingredient}-${index}`}
                className="flex items-center whitespace-nowrap"
              >
                <span className="w-20 text-black font-regular mr-2">
                  {formatQuantity(ing.value * portions)} {ing.unit}
                </span>
                <span className="text-gray-500">
                  {ing.ingredient.charAt(0).toUpperCase() + ing.ingredient.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fremgangsmåte */}
      <div className="mb-4">
        <h3 className="font-light mb-2">Slik gjør du</h3>
        {!expanded && (
          <LesMer expanded={expanded} onClick={toggleExpanded} />
        )}
        {expanded && (
          <>
            <Instructions instructions={post.instructions} />
            <Comments comments={post.comments} owner={post.user} />

            <LesMer expanded={expanded} onClick={toggleExpanded} />
          </>
        )}
      </div>
    </div>
  );
}
