import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

export default function Comments({ comments, owner = null, onNewComment }) {
  const [newComment, setNewComment] = useState('');
  const commentsContainerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      if (onNewComment) {
        onNewComment(newComment);
      }
      setNewComment('');
    }
  };

  // Når kommentarene oppdateres, scroll til bunnen slik at de nyeste vises
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [comments]);

  const renderComment = (comment) => {
    const isOwner =
      owner &&
      ((comment.author?._id && owner._id && comment.author._id === owner._id) ||
       (comment.author?.username && owner.username && comment.author.username === owner.username));

    const rawUsername = comment.author?.username || 'anonym';
    const username = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);

    const avatarElement = comment.author?.avatarUrl ? (
      <img
        src={comment.author.avatarUrl}
        alt={username}
        className="w-7 h-7 rounded-full object-cover mr-2"
      />
    ) : (
      <FaUserCircle className="w-7 h-7 mr-2 text-gray-500" />
    );

    const commentBubble = (
      <div
        className={`w-64 p-2 rounded-md shadow-sm transition-all duration-200 ${
          isOwner ? 'bg-green-50' : 'bg-gray-50'
        } text-left`}
      >
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-regular text-sm">
            {username}{isOwner && ' Forfatter'}
          </span>
          {comment.createdAt && (
            <span className="text-xs text-gray-600">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
      </div>
    );

    return (
      <div key={comment._id || Math.random()} className="flex items-start mb-3 flex-row">
        {avatarElement}
        {commentBubble}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="font-regular text-lg mb-4">Kommentarer</h3>
      {/* Kommentar-container med fast høyde (ca. tre kommentarer) og overflow-y scroll */}
      <div 
        ref={commentsContainerRef}
        className="overflow-y-auto"
        style={{ maxHeight: '240px' }}
      >
        {comments.map(renderComment)}
      </div>
      {/* Inputfelt for ny kommentar */}
      <form onSubmit={handleSubmit} className="mt-4 mb-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Skriv en kommentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow h-8 p-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[var(--color-PMgreen)] focus:border-[var(--color-PMgreen)] text-sm"
          />
          <button
            type="submit"
            className="h-8 px-1 bg-[var(--color-PMgreen)] text-white border border-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-[var(--color-PMgreen)] active:bg-[var(--color-PMgreen)] active:border-[var(--color-PMgreen)]"
          >
            <FiSend className="text-lg" />
          </button>
        </div>
      </form>
    </div>
  );
}
