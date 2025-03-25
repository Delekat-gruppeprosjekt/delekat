import { PiGearSixLight } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../../../auth";
import { auth, firestore } from "../../../firebase";
import { updateProfile } from "firebase/auth";
import { getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";

function ProfilePage() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1280);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/assets/avatar_placeholder.png");
  const [userRecipes, setUserRecipes] = useState([]); // State for user's recipes
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 1280);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || "Username");
      setAvatarUrl(user.photoURL || "/assets/avatar_placeholder.png");
      fetchUserRecipes(user.uid); // Fetch recipes created by the user
    } else {
      setDisplayName(localStorage.getItem("username") || "Username");
      setAvatarUrl(localStorage.getItem("avatar") || "/assets/avatar_placeholder.png");
    }
  }, []);

  // Fetch recipes created by the logged-in user
  const fetchUserRecipes = async (userId) => {
    try {
      const ref = collection(firestore, "recipes");
      const q = query(ref, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const recipes = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserRecipes(recipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  };

  // Handle recipe deletion
  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Er du sikker på at du vil slette denne oppskriften?")) return;
    
    try {
      await deleteDoc(doc(firestore, "recipes", recipeId));
      setUserRecipes(userRecipes.filter((recipe) => recipe.id !== recipeId)); // Update UI
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  // Get data from localStorage
  const email = localStorage.getItem("email") || "Email";

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await doSignOut();
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Function to handle modal form submission
  const handleSaveProfileChanges = () => {
    if (newBio) {
      localStorage.setItem("bio", newBio);
    }
    if (newAvatarUrl) {
      updateAvatar(newAvatarUrl);
    }
    setIsModalOpen(false);
  };

  // Function to update avatar URL in Firebase
  const updateAvatar = async (url) => {
    try {
      await updateProfile(auth.currentUser, { photoURL: url });
      setAvatarUrl(url);
      localStorage.setItem("avatar", url);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      {/* Log Out Button at the top */}
      <div className="flex justify-between items-center mb-6">
        <button className="text-red-500 hover:text-red-700 transition duration-150" onClick={handleLogout}>
          Logg ut
        </button>

        {!isLargeScreen && (
          <div className="flex items-center gap-2 hover:scale-110 duration-150 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            Rediger Profil <PiGearSixLight className="text-xl" />
          </div>
        )}
      </div>

      <div id="profileContainer" className="flex flex-col justify-center items-center my-16">
        <img className="w-72 rounded-full border-BGwhite border-4 mb-4" src={avatarUrl} alt="User Avatar" />
        <h1 className="text-2xl font-black">{displayName}</h1>
        <p>{email}</p>
        <p className="w-3/4 text-center">
          Bio: {localStorage.getItem("bio") || "No bio set."}
        </p>
      </div>

      {/* User's Recipes Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Dine Oppskrifter</h2>
        {userRecipes.length === 0 ? (
          <p className="text-center text-gray-500">Du har ingen oppskrifter enda.</p>
        ) : (
          <ul className="space-y-4">
            {userRecipes.map((recipe) => (
              <li key={recipe.id} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{recipe.title}</h3>
                  <p>{recipe.description}</p>
                </div>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                  onClick={() => handleDeleteRecipe(recipe.id)}
                >
                  Slett
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for editing profile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-2xl font-bold mb-4">Rediger Profil</h2>
            
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

            <div className="mb-4">
              <label htmlFor="avatar" className="block text-lg font-semibold">Endre avatar (URL)</label>
              <input
                type="text"
                id="avatar"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Skriv inn din avatar URL"
              />
            </div>

            <div className="flex justify-between">
              <button onClick={handleSaveProfileChanges} className="bg-green-500 text-white px-4 py-2 rounded-md">
                Lagre
              </button>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">
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