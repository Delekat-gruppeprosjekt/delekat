import { PiGearSixLight } from "react-icons/pi";
import { useState, useEffect } from "react";

function ProfilePage() {

    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1280);
  
    useEffect(() => {
      const handleResize = () => setIsLargeScreen(window.innerWidth > 1280);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <div className="min-h-screen bg-BGcolor p-6">
        {!isLargeScreen && (<div className="flex items-center gap-2 absolute top-0 right-0 m-8 hover:scale-110 duration-150 cursor-pointer">Rediger Profil <PiGearSixLight className="text-xl" /></div>)}
        <div id="profileContainer" className="flex flex-col justify-center items-center my-16">
            <img className="w-72 rounded-full border-BGwhite border-4 mb-4" src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"></img>
            <h1 className="text-2xl font-black">Firstname Lastname</h1>
            <p>@username</p>
            <p className="w-3/4 text-center">Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div id="recipesContainer" className="flex justify-center">
            <div className="flex flex-row justify-evenly w-full text-2xl">
                <h1 className="hover:border-b-1 cursor-pointer">Dine oppskrifter</h1>
                <h1 className="hover:border-b-1 cursor-pointer">Favoritter</h1>
                <h1 className="hover:border-b-1 cursor-pointer">Brukere</h1>
            </div>
        </div>
      </div>
    )
  }
  
  export default ProfilePage