import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function Comments({ comments, owner = null }) {
  if (!comments || comments.length === 0) return null;

  const renderComment = (comment) => {
  
    const isOwner =
      owner &&
      ((comment.author?._id && owner._id && comment.author._id === owner._id) ||
       (comment.author?.username && owner.username && comment.author.username === owner.username));

  
    console.log(`Kommentar fra ${comment.author?.username || 'Anonym'}: isOwner=${isOwner}`);

    const username = comment.author?.username || 'Anonym';

    const avatarElement = comment.author?.avatarUrl ? (
      <img
        src={comment.author.avatarUrl}
        alt={username}
        className={`w-10 h-10 rounded-full object-cover ${isOwner ? 'ml-4' : 'mr-4'}`}
      />
    ) : (
      <FaUserCircle
        className={`w-10 h-10 ${isOwner ? 'ml-4 text-[var(--color-PMgreen)]' : 'mr-4 text-gray-500'}`}
      />
    );

    const commentBubble = (
      <div
        className={`max-w-md p-4 rounded-lg shadow transition-all duration-200 ${
          isOwner ? 'bg-green-50 text-right' : 'bg-gray-50 text-left'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="font-semibold text-sm">{username}</span>
            {isOwner && (
              <span
                className="ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full uppercase"
                style={{ backgroundColor: 'var(--color-SGgreen)', color: 'var(--color-PMgreen)' }}
              >
                Eier
              </span>
            )}
          </div>
          {comment.createdAt && (
            <span className="text-xs text-gray-600">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700">{comment.text}</p>
      </div>
    );

    return (
      <div
        key={comment._id || Math.random()}
        className={`flex items-start mb-6 ${isOwner ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {avatarElement}
        {commentBubble}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-4">Kommentarer</h3>
      {comments.map(renderComment)}
    </div>
  );
}
