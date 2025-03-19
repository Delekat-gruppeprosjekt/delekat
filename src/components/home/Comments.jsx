import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

// Funksjon som sjekker om kommentaren er skrevet av post-eieren
function renderComment(comment, ownerUsername) {
  const isOwner = comment.author?.username === ownerUsername;
  const username = comment.author?.username || 'Anonym';

  // Velg riktig avatar
  const avatarElement = comment.author?.avatarUrl ? (
    <img
      src={comment.author.avatarUrl}
      alt={username}
      className={`w-8 h-8 rounded-full ${isOwner ? 'ml-3' : 'mr-3'}`}
    />
  ) : (
    <FaUserCircle className={`w-8 h-8 text-gray-400 ${isOwner ? 'ml-3' : 'mr-3'}`} />
  );

  // Kommentarboblen med tekst og metainfo
  const commentBubble = (
    <div
      className={`max-w-xs p-3 rounded-lg shadow-sm ${
        isOwner ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm">{username}</span>
        {comment.createdAt && (
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-700">{comment.text}</p>
    </div>
  );

  // Ved eier, flytt avataren til høyre ved å bruke flex-row-reverse
  return (
    <div
      key={comment._id}
      className={`flex items-start mb-4 ${
        isOwner ? 'flex-row-reverse justify-end' : 'flex-row justify-start'
      }`}
    >
      {avatarElement}
      {commentBubble}
    </div>
  );
}

export default function Comments({ comments, ownerUsername }) {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Kommentarer</h3>
      {comments.map((comment) => renderComment(comment, ownerUsername))}
    </div>
  );
}
