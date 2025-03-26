import { PiHouseSimple } from "react-icons/pi";
import { PiPlusCircle } from "react-icons/pi";
import { PiUserLight } from "react-icons/pi";
import { PiGearSixLight } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Header() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1280);
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  
  const auth = getAuth(); // Get Firebase auth instance

  // Fetch logged-in user data securely
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
        setUserId(user.uid); // Get secure user ID
      } else {
        setUserLoggedIn(false);
        setUserId(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [auth]);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 1280);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <header className="bg-BGwhite fixed bottom-0 w-full opacity-90 border-navbar-border border-t-1
                        xl:left-0 xl:h-full xl:w-100 xl:border-r-1 xl:border-t-0 xl:opacity-100">
      <nav className="flex flex-row w-full px-10 h-16 justify-between items-left text-2xl
                        xl:left-0 xl:flex-col xl:h-1/5 xl:justify-evenly xl:text-lg">
        <Link to="/" className={`flex items-center gap-2 hover:scale-110 transition duration-150 w-max ${activePath === "/" ? "text-PMgreen" : ""}`}>
          <PiHouseSimple /> {isLargeScreen ? "Hjem" : ""}
        </Link>
        
        {userLoggedIn && (
          <Link to="/create" className={`flex items-center gap-2 hover:scale-110 transition duration-150 w-max ${activePath === "/create" ? "text-PMgreen" : ""}`}>
            <PiPlusCircle /> {isLargeScreen ? "Post ny oppskrift" : ""}
          </Link>
        )}

        {/* Change link based on userLoggedIn status */}
        <Link
          to={userLoggedIn && userId ? `/profile/${userId}` : "/login"}
          className={`flex items-center gap-2 hover:scale-110 transition duration-150 w-max ${
            activePath === (userLoggedIn && userId ? `/profile/${userId}` : "/login") ? "text-PMgreen" : ""
          }`}
        >
          <PiUserLight /> {isLargeScreen ? (userLoggedIn ? "Profil" : "Logg inn") : ""}
        </Link>

        {isLargeScreen && userLoggedIn && (
          <div id="editProfile" className="flex absolute bottom-8 items-center gap-2 hover:scale-110 transition duration-150 w-max cursor-pointer">
            <PiGearSixLight /> Rediger Profil
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
