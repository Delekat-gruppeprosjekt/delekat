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
    return <div className="p-8">Laster...</div>
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-20">
      {filteredPosts.map((post) => (
        <HomeCard key={post._id} post={post} />
      ))}
    </div>
  )
}
