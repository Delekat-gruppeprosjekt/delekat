import { PiGearSixLight } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { doSignOut } from "../../../auth";
import { auth, firestore } from "../../../firebase";
import { updateProfile } from "firebase/auth";
import { getDocs, getDoc, collection, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";

function ProfilePage() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1280);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/assets/avatar_placeholder.png");
  const [userRecipes, setUserRecipes] = useState([]);
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
      fetchUserDetails(user.uid);  // Fetch user details
      fetchUserRecipes(user.uid);  // Fetch user recipes
    } else {
      setDisplayName(localStorage.getItem("username") || "Username");
      setAvatarUrl(localStorage.getItem("avatar") || "/assets/avatar_placeholder.png");
    }
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const userRef = doc(firestore, "users", userId);  // Use the correct document reference
      const userDoc = await getDoc(userRef);  // Fetch the user document

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setDisplayName(userData.displayName || "Username");
        setAvatarUrl(userData.avatarUrl || "/assets/avatar_placeholder.png");
      } else {
        console.log("No such user found!");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

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

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Er du sikker på at du vil slette denne oppskriften?")) return;

    try {
      await deleteDoc(doc(firestore, "recipes", recipeId));
      setUserRecipes(userRecipes.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleEditRecipe = (recipeId) => {
    navigate(`/edit/${recipeId}`);
  };

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

  const handleSaveProfile = async () => {
    try {
      // Update the user's profile with new bio and avatar URL
      await updateProfile(auth.currentUser, {
        photoURL: newAvatarUrl || avatarUrl,
        displayName: displayName,
      });

      // Update the user document in Firestore
      const userRef = doc(firestore, "users", auth.currentUser.uid);  // Get user document reference
      await updateDoc(userRef, {
        bio: newBio || "", // Update bio
        avatarUrl: newAvatarUrl || avatarUrl, // Update avatar URL
      });

      // Update local storage and state
      localStorage.setItem("bio", newBio || localStorage.getItem("bio"));
      localStorage.setItem("avatar", newAvatarUrl || avatarUrl);
      setAvatarUrl(newAvatarUrl || avatarUrl);
      setIsModalOpen(false); // Close modal after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-BGcolor p-6">
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
        <p>{localStorage.getItem("email") || "Email"}</p>
        <p className="w-3/4 text-center">
          Bio: {localStorage.getItem("bio") || "No bio set."}
        </p>
      </div>

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
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition"
                    onClick={() => handleEditRecipe(recipe.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    onClick={() => handleDeleteRecipe(recipe.id)}
                  >
                    Slett
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for Editing Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Rediger Profil</h2>
            <div className="mb-4">
              <label className="block text-lg">New Bio:</label>
              <textarea
                className="w-full p-2 border rounded-md"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Enter your new bio"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-lg">New Avatar URL:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="Enter your new avatar URL"
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={handleSaveProfile}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
