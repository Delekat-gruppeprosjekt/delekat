import React, { useState, useEffect } from 'react'
import HomeCard from './HomeCard.jsx'
import { API_ALL_POSTS, SANITY_TOKEN } from '../constants.js'

export default function HomeList({ searchQuery }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API_ALL_POSTS, {
      headers: {
        Authorization: `Bearer ${SANITY_TOKEN}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.result || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="flex justify-center w-full">
      <div
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status">
    <span
      className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >Loading...</span>
  </div>
  </div>
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
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
  )
}
