// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { userId } = useParams(); // Get the userId from the URL parameters
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
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
          <img className="w-72 rounded-full object-cover" src={userData?.avatarUrl || "/assets/avatar_placeholder.png"} alt="User Avatar" />
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold">{userData?.displayName}</h1>
        <p className="text-xl">{userData?.bio || "No bio set."}</p>
      </div>

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
