import { PiHouseSimple } from "react-icons/pi";
import { PiPlusCircle } from "react-icons/pi";
import { PiUserLight } from "react-icons/pi";
import { PiGearSixLight } from "react-icons/pi";
import { PiSignOutLight } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useToast } from '../contexts/toastContext/toast';

function Header() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1280);
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname);
  const db = getFirestore();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
        setUserId(user.uid);
      } else {
        setUserLoggedIn(false);
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 1279);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const [userIden, setUserIden] = useState(null);
  
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserIden(id);
  }, []);

  const handleEditProfile = () => {
    navigate(`/edit-profile/${userIden}`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          setError('User not found!');
          showToast('Kunne ikke finne brukerdata', 'error');
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
        showToast('Kunne ikke hente brukerdata', 'error');
      } 
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, db, showToast]);

  /** Dette er for logg ut knappen */

  const handleLogout = async () => {
    const auth = getAuth(); // Get Firebase Auth instance

    try {
      await signOut(auth);
      localStorage.clear();
      showToast('Du er nå logget ut', 'success');
      navigate("/");
    } catch (err) {
      console.error("Error during logout:", err);
      showToast('Det oppstod en feil ved utlogging', 'error');
    }
  };

  return (
    <header className="bg-BGwhite fixed bottom-0 w-full opacity-90 border-navbar-border border-t-1
                        xl:left-0 xl:h-full xl:w-100 xl:border-r-1 xl:border-t-0 xl:opacity-100">
      <nav className="flex flex-row w-full px-10 h-16 justify-between items-left text-2xl
                        xl:left-0 xl:flex-col xl:h-1/5 xl:justify-evenly xl:text-2xl xl:space-y-4">

        {isLargeScreen && userLoggedIn && (
          <div className="flex flex-col items-center justify-center my-8">
             <div className="w-36 h-36 rounded-full overflow-hidden">
              <img
                className="w-full h-full rounded-full object-cover"
                src={userData?.avatarUrl || "/assets/avatar_placeholder.png"}
                alt="User Avatar"
              />
            </div>
            <h1 className="text-3xl font-bold">{userData?.displayName}</h1>
          </div>
        )}

        <Link to="/" className={`flex items-center gap-2 hover:scale-110 transition duration-150 w-max ${activePath === "/" ? "text-PMgreen" : ""}`}>
          <PiHouseSimple /> {isLargeScreen ? "Hjem" : ""}
        </Link>
        
        {userLoggedIn && (
          <Link to="/create" className={`flex items-center gap-2 hover:scale-110 transition duration-150 w-max ${activePath === "/create" ? "text-PMgreen" : ""}`}>
            <PiPlusCircle /> {isLargeScreen ? "Post ny oppskrift" : ""}
          </Link>
        )}

        <Link
          to={userLoggedIn && userId ? `/profile/${userId}` : "/login"}
          className={`flex items-center gap-2 hover:scale-110 transition duration-150 w-max ${
            activePath === (userLoggedIn && userId ? `/profile/${userId}` : "/login") ? "text-PMgreen" : ""
          }`}
        >
          {!isLargeScreen && userLoggedIn ? (
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={userData?.avatarUrl || "/assets/avatar_placeholder.png"}
              alt="User Avatar"
            />
          ) : (
            <PiUserLight />
          )}
          {isLargeScreen ? (userLoggedIn ? "Profil" : "Logg inn") : ""}
        </Link>

        {isLargeScreen && userLoggedIn && (
          <div className="absolute bottom-8 space-y-4">
            <button
              id="editProfile"
              className="flex items-center gap-2 hover:scale-110 transition duration-150 w-max cursor-pointer"
              onClick={handleEditProfile}
            >
              <PiGearSixLight /> Rediger Profil
            </button>

            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 hover:scale-110 hover:text-red-btn-hover transition duration-150 w-max cursor-pointer"
            >
              <PiSignOutLight /> Logg ut 
            </button>
          </div>
        )}
     
      </nav>
    </header>
  );
}

export default Header;
