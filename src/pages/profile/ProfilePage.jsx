import { PiGearSixLight } from "react-icons/pi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { doSignOut } from "../../../auth";
import { auth, firestore } from "../../../firebase";
import { updateProfile } from "firebase/auth";
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import RecipeCard from "../../components/profile/RecipeCard";

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
      fetchUserRecipes(user.uid);
    } else {
      setDisplayName(localStorage.getItem("username") || "Username");
      setAvatarUrl(
        localStorage.getItem("avatar") || "/assets/avatar_placeholder.png"
      );
    }
  }, []);

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
    if (!window.confirm("Er du sikker på at du vil slette denne oppskriften?"))
      return;

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

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-red-500 hover:text-red-700 transition duration-150"
          onClick={handleLogout}
        >
          Logg ut
        </button>
        {!isLargeScreen && (
          <div
            className="flex items-center gap-2 hover:scale-110 duration-150 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Rediger Profil <PiGearSixLight className="text-xl" />
          </div>
        )}
      </div>

      <div
        id="profileContainer"
        className="flex flex-col justify-center items-center my-16"
      >
        <img
          className="w-48 rounded-full border-BGwhite border-4 mb-4"
          src={avatarUrl}
          alt="User Avatar"
        />
        <h1 className="text-2xl font-black">{displayName}</h1>
        <p>{localStorage.getItem("email") || "Email"}</p>
        <p className="w-3/4 text-center">
          Bio: {localStorage.getItem("bio") || "No bio set."}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Dine Oppskrifter
        </h2>
        {userRecipes.length === 0 ? (
          <p className="text-center text-gray-500">
            Du har ingen oppskrifter enda.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={() => handleEditRecipe(recipe.id)}
                onDelete={() => handleDeleteRecipe(recipe.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
