import React from 'react'
import CreatePostForm from '../../components/postForm/PostForm'

export default function CreatePost() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Create Post</h1>
      <CreatePostForm />
    </div>
  )
}