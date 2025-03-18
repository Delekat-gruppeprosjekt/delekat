import React from 'react'
<<<<<<< HEAD:src/pages/Home.jsx
import HomeList from '../components/home/HomeList'
import Logo from '../components/header/Logo'


=======
import HomeList from './pages/home/HomeList'
>>>>>>> main:src/Home.jsx

export default function Home() {
  return (
    <div className=" min-h-screen p-6 bg-[var(--color-BGcolor)]">
      <Logo width={200} height={120} className="mb-24" />
      <h1 className="text-3xl font-thin mb-6 flex justify-center mt-8" >La deg friste</h1>
      <HomeList />
    </div>
  )
}
