import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart } from 'react-icons/fa';
import { IoChatbubbleOutline } from "react-icons/io5";
import { PiChefHat } from "react-icons/pi";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");
  const [newBio, setNewBio] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const { userId } = useParams();
  const db = getFirestore();
  const auth = getAuth();

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
          const data = userDocSnap.data();
          setUserData(data);
          setNewAvatar(data.avatarUrl || "");
          setNewBio(data.bio || "");
        } else {
          setError("User not found!");
        }

        const recipesQuery = query(collection(db, "recipes"), where("userId", "==", userId));
        const recipesSnapshot = await getDocs(recipesQuery);
        const recipes = recipesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setUserRecipes(recipes);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSaveChanges = async () => {
    if (!userData || currentUserId !== userId) return;

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        avatarUrl: newAvatar,
        bio: newBio,
        updatedAt: new Date()
      });

      setUserData((prev) => ({ ...prev, avatarUrl: newAvatar, bio: newBio }));
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Er du sikker på at du vil slette denne oppskriften?")) return;

    try {
      const recipeRef = doc(db, "recipes", recipeId);
      await deleteDoc(recipeRef);
      setUserRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (err) {
      console.error("Error deleting recipe:", err);
      setError("Failed to delete recipe.");
    }
  };

  const handleEditRecipe = (recipeId) => {
    navigate(`/edit/${recipeId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="flex justify-center items-center mb-6">
        <div className="w-72 rounded-full border-BGwhite border-4 mb-4">
          <img
            className="w-72 rounded-full object-cover"
            src={userData?.avatarUrl || "/assets/avatar_placeholder.png"}
            alt="User Avatar"
          />
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold">{userData?.displayName}</h1>
        <p className="text-xl">{userData?.bio || "No bio set."}</p>
        {currentUserId === userId && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Rediger Profil
          </button>
        )}
      </div>

      {/* Modal for Editing Profile */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Rediger Profil</h2>
            <label className="block text-sm font-medium text-gray-700">Ny Avatar URL</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Ny Bio</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mt-1"
              rows="3"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
            ></textarea>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Lagre Endringer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Dine Oppskrifter</h2>
        {userRecipes.length === 0 ? (
          <p className="text-center text-gray-500">Du har ingen oppskrifter enda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRecipes.map((recipe) => (
              <div key={recipe.id} className="max-w-sm mx-auto p-4 bg-white rounded-xl shadow mb-8 flex flex-col">
                {/* Header with user info and difficulty level */}
                <div className="flex items-center mb-4">
                  <img
                    src={userData?.avatarUrl || "/assets/avatar_placeholder.png"}
                    alt={userData?.displayName || "Anonym"}
                    className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-300"
                  />
                  <div className="flex items-center justify-between w-full">
                    <span className="font-regular text-blue-500">{userData?.displayName || 'Anonym'}</span>
                    <div className="flex items-center">
                      <PiChefHat className="text-xl mr-2 -mt-2" />
                      <span>{recipe.difficulty || "Lett"}</span>
                    </div>
                  </div>
                </div>
                
                {/* Image or placeholder */}
                <div className="mb-4">
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-60 object-cover"
                    />
                  ) : (
                    <div className="w-full h-50 bg-gray-300 flex items-center justify-center rounded-lg">
                      <span className="text-gray-500">Placeholder Image</span>
                    </div>
                  )}
                </div>

                {/* Post Info with title and icons */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <h1 className="text-xl font-light">{recipe.title}</h1>
                    <div className="flex space-x-4">
                      <span className="flex items-center space-x-1">
                        <FaHeart />
                        <span>{recipe.likes || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <IoChatbubbleOutline />
                        <span>{recipe.comments ? recipe.comments.length : 0}</span>
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{recipe.description}</p>
                </div>

                {/* Edit and Delete buttons for recipe owner */}
                {currentUserId === userId && (
                  <div className="flex justify-end space-x-2 mt-auto">
                    <button
                      onClick={() => handleEditRecipe(recipe.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Slett
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
