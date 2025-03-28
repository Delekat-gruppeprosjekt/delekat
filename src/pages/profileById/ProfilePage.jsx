import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";
import RecipeCard from "../../components/Profile/RecipeCardProfile";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");
  const [newBio, setNewBio] = useState("");

  const { userId } = useParams();
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          setError("User not found!");
        }

        const recipesQuery = query(
          collection(db, "recipes"),
          where("userId", "==", userId)
        );
        const recipesSnapshot = await getDocs(recipesQuery);
        const recipes = recipesSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserRecipes(recipes);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isOwnProfile = currentUserId === userId;

  const handleEditProfile = () => {
    navigate(`/edit-profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="flex justify-center items-center mb-6">
        <div className="w-36 h-36 rounded-full border-BGwhite border-4 mb-4 overflow-hidden">
          <img
            className="w-full h-full rounded-full object-cover"
            src={userData?.avatarUrl || "/assets/avatar_placeholder.png"}
            alt="User Avatar"
          />
        </div>
      </div>

      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-3xl font-bold">{userData?.displayName}</h1>
        <p className="text-xl break-words">{userData?.bio || "No bio set."}</p>
        {isOwnProfile && (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isOwnProfile ? "Your Recipes" : `${userData?.displayName}'s Recipes`}
        </h2>
        {userRecipes.length === 0 ? (
          <p className="text-center text-gray-500">
            {isOwnProfile
              ? "You have no recipes yet."
              : "This user has no recipes yet."}
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none">
            {userRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={
                  isOwnProfile
                    ? () => console.log(`Edit recipe ${recipe.id}`)
                    : null
                }
                onDelete={
                  isOwnProfile
                    ? () => console.log(`Delete recipe ${recipe.id}`)
                    : null
                }
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
