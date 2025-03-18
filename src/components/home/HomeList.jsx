import React, { useState, useEffect } from 'react'
import HomeCard from './HomeCard.jsx'
import { API_ALL_POSTS, SANITY_TOKEN } from '../constants.js'

export default function HomeList() {
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

  return (
    <div>
      {posts.map((post) => (
        <HomeCard key={post._id} post={post} />
      ))}
    </div>
  )
}
