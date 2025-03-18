import React from 'react'
import HomeList from './HomeList'

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      <HomeList />
    </div>
  )
}
