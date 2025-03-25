import React from 'react';
import HomeCard from './HomeCard.jsx';

export default function HomeList({ posts, searchQuery }) {
  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  return (
    <div className="mb-20">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <HomeCard key={post._id} post={post} />
        ))
      ) : (
        <p className="text-center">Fant ingen oppskrifter</p>
      )}
    </div>
  );
}
