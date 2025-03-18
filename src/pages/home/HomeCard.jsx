import React from 'react'
import { FaUserCircle, FaHeart, FaEye } from 'react-icons/fa'
import { MdTimer } from 'react-icons/md'

export default function HomeCard({ post }) {
  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow mb-8">
      {/* Header med brukerinfo */}
      <div className="flex items-center mb-4">
        {post.user?.avatarUrl ? (
          <img
            src={post.user.avatarUrl}
            alt={post.user.username}
            className="w-8 h-8 rounded-full mr-2"
          />
        ) : (
          <FaUserCircle className="text-2xl mr-2" />
        )}
        <span className="font-bold">{post.user?.username || 'Anonym'}</span>
      </div>

      {/* Bilde eller placeholder */}
      <div className="mb-4">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">Placeholder Image</span>
          </div>
        )}
      </div>

      {/* Post-info */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
        <div className="flex justify-between items-center">
          <span className="flex items-center space-x-1">
            <MdTimer />
            <span>N/A</span>
          </span>
          <div className="flex space-x-4">
            <span className="flex items-center space-x-1">
              <FaHeart />
              <span>{post.likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FaEye />
              <span>{post.comments ? post.comments.length : 0}</span>
            </span>
          </div>
        </div>
        <p className="mt-2 text-gray-700">{post.description}</p>
      </div>

      {/* Ingredienser */}
      {post.ingredients && post.ingredients.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Ingredienser</h3>
          <ul className="list-disc list-inside">
            {post.ingredients.map((ing, index) => (
              <li key={index}>
                {ing.value} {ing.unit} {ing.ingredient}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fremgangsmåte */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Slik gjør du</h3>
        <p>{post.instructions}</p>
      </div>

      {/* Kommentarer */}
      {post.comments && post.comments.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Kommentarer</h3>
          {post.comments.map((comment) => (
            <div key={comment._id} className="flex items-start mb-2">
              {comment.author?.avatarUrl ? (
                <img
                  src={comment.author.avatarUrl}
                  alt={comment.author.username}
                  className="w-6 h-6 rounded-full mr-2"
                />
              ) : (
                <FaUserCircle className="text-lg mr-2" />
              )}
              <div>
                <span className="font-bold">
                  {comment.author?.username || 'Anonym'}
                </span>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
        Les Oppskrift
      </button>
    </div>
  )
}
