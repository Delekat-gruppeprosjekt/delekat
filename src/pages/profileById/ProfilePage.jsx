import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");
  const [newBio, setNewBio] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null); // Store the logged-in user's ID

  const { userId } = useParams(); // Get userId from the URL
  const db = getFirestore();
  const auth = getAuth();

  // Fetch the logged-in user's ID securely
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid); // Securely get the logged-in user's UID
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, [auth]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
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

        // Fetch recipes created by the user
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
    if (!userData) return;

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        avatarUrl: newAvatar,
        bio: newBio,
      });

      setUserData((prev) => ({ ...prev, avatarUrl: newAvatar, bio: newBio }));
      setIsEditing(false); // Close modal after saving
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
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

        {/* Only show "Rediger Profil" if user is logged in and viewing their own profile */}
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
          <ul className="space-y-4">
            {userRecipes.map((recipe) => (
              <li key={recipe.id} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{recipe.title}</h3>
                  <p>{recipe.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
