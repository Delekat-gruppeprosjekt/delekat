import { PiGearSixLight } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for redirection
import { doSignOut } from "../../../auth";  // Import doSignOut function
import { auth } from "../../../firebase";  // Import Firebase auth
import { updateProfile } from "firebase/auth";  // Firebase updateProfile function

function ProfilePage() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1280);
  const [isModalOpen, setIsModalOpen] = useState(false);  // State for modal visibility
  const [newBio, setNewBio] = useState("");  // State for bio input
  const [newAvatarUrl, setNewAvatarUrl] = useState("");  // State for avatar URL input
  const [displayName, setDisplayName] = useState("");  // State for display name
  const [avatarUrl, setAvatarUrl] = useState("/assets/avatar_placeholder.png"); // Default avatar image URL
  const navigate = useNavigate();  // Hook to handle navigation

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 1280);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch the current user's display name and photoURL from Firebase Authentication
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || "Username");  // Default to "Username" if displayName is not available
      setAvatarUrl(user.photoURL || "/assets/avatar_placeholder.png");  // Set avatar URL from Firebase
    } else {
      setDisplayName(localStorage.getItem("username") || "Username");  // Fallback to localStorage if not authenticated
      setAvatarUrl(localStorage.getItem("avatar") || "/assets/avatar_placeholder.png");
    }
  }, []);

  // Get data from localStorage
  const email = localStorage.getItem("email") || "Email";  // Default to "Email" if not available

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await doSignOut();  // Sign the user out using the doSignOut function from your auth file
      localStorage.removeItem("username");
      localStorage.removeItem("email");

      // Navigate to the Home page after logging out
      navigate("/");  // Navigate to Home page ("/")
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Function to handle modal form submission (updating bio and avatar)
  const handleSaveProfileChanges = () => {
    if (newBio) {
      localStorage.setItem("bio", newBio);  // Save new bio in localStorage (or update Firebase if needed)
    }
    if (newAvatarUrl) {
      updateAvatar(newAvatarUrl);  // Update the avatar URL in Firebase Authentication
    }
    setIsModalOpen(false);  // Close the modal after saving
  };

  // Function to update avatar URL in Firebase Authentication
  const updateAvatar = async (url) => {
    try {
      // Update the user's profile with the new avatar URL
      await updateProfile(auth.currentUser, { photoURL: url });
      setAvatarUrl(url);  // Update the avatar URL in the state
      localStorage.setItem("avatar", url);  // Save the new avatar URL to localStorage
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      {/* Log Out Button at the top */}
      <div className="flex justify-between items-center mb-6">
        <button 
          className="text-red-500 hover:text-red-700 transition duration-150"
          onClick={handleLogout}
        >
          Logg ut
        </button>

        {/* Show the "Edit Profile" button only on small screens */}
        {!isLargeScreen && (
          <div
            className="flex items-center gap-2 hover:scale-110 duration-150 cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open the modal when clicked
          >
            Rediger Profil <PiGearSixLight className="text-xl" />
          </div>
        )}
      </div>

      <div id="profileContainer" className="flex flex-col justify-center items-center my-16">
        {/* Profile avatar */}
        <img 
          className="w-72 rounded-full border-BGwhite border-4 mb-4" 
          src={avatarUrl} 
          alt="User Avatar" 
        />

        {/* Display displayName from Firebase or localStorage */}
        <h1 className="text-2xl font-black">{displayName}</h1>
        <p>{email}</p>

        {/* User bio */}
        <p className="w-3/4 text-center">
          Bio: {localStorage.getItem("bio") || "No bio set."}
        </p>
      </div>

      {/* Navigation links for recipes, favorites, and users */}
      <div id="recipesContainer" className="flex justify-center mb-24">
        <div className="flex flex-row justify-evenly w-full text-2xl">
          <h1 className="hover:border-b-1 cursor-pointer">Dine oppskrifter</h1>
          <h1 className="hover:border-b-1 cursor-pointer">Favoritter</h1>
          <h1 className="hover:border-b-1 cursor-pointer">Brukere</h1>
        </div>
      </div>

      {/* Modal for editing profile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-2xl font-bold mb-4">Rediger Profil</h2>
            
            {/* Bio input */}
            <div className="mb-4">
              <label htmlFor="bio" className="block text-lg font-semibold">Endre bio</label>
              <textarea
                id="bio"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Skriv din nye bio her..."
              />
            </div>
            
            {/* Avatar URL input */}
            <div className="mb-4">
              <label htmlFor="avatar" className="block text-lg font-semibold">Endre avatar (URL)</label>
              <input
                type="text"
                id="avatar"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}  // Update the URL state
                className="w-full p-2 border rounded-md"
                placeholder="Skriv inn din avatar URL"
              />
            </div>

            {/* Save and Cancel buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleSaveProfileChanges}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Lagre
              </button>
              <button
                onClick={() => setIsModalOpen(false)}  // Close modal without saving
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
