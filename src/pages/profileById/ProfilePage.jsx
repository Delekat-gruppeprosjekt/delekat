import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import RecipeCard from "../../components/Profile/RecipeCardProfile";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isRecipesView, setIsRecipesView] = useState(true);

  const { userId } = useParams();
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setIsAdmin(userDocSnap.data().isAdmin || false);
        }
      } else {
        setCurrentUserId(null);
        setIsAdmin(false);
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
        // Sort recipes by createdAt timestamp in descending order (newest first)
        const sortedRecipes = recipes.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB - dateA;
        });
        setUserRecipes(sortedRecipes);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleDeleteRecipe = async (recipeId) => {
    const isOwnProfile = currentUserId === userId;
    if (!isAdmin && !isOwnProfile) {
      alert("Du har ikke retigheter til å slette denne oppskriften.");
      return;
    }

    try {
      await deleteDoc(doc(db, "recipes", recipeId));
      setUserRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
      alert("Oppskriften ble slettet.");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Kunne ikke slette oppskriften.");
    }
  };

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, "users"));
      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
        avatarUrl: doc.data().avatarUrl,
        displayName: doc.data().displayName,
      }));
      setUserList(users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const toggleView = (view) => {
    setIsRecipesView(view === "recipes");
    if (view === "users" && isAdmin) {
      fetchUsers();
    }
  };

  if (loading) return <div>Laster...</div>;
  if (error) return <div>Error: {error}</div>;

  const isOwnProfile = currentUserId === userId;
  const handleEditProfile = () => navigate(`/edit-profile/${userId}`);


  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="flex justify-center items-center mb-6">
        <div className="w-36 h-36 rounded-full border-BGwhite border-4 overflow-hidden">
          <img
            className="w-full h-full rounded-full object-cover"
            src={userData?.avatarUrl || "/assets/avatar_placeholder.png"}
            alt="User Avatar"
          />
        </div>
      </div>

      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-3xl font-bold">{userData?.displayName}</h1>
        <p className="text-xl break-words">{userData?.bio || ""}</p>
        {isOwnProfile && (
          <button
            className="mt-4 px-4 py-2 bg-green-btn text-BGwhite font-semibold rounded-lg hover:bg-green-btn-hover"
            onClick={handleEditProfile}
          >
            Rediger profil
          </button>
        )}

                {/* Only show the toggle buttons if the user is an admin */}
                {isAdmin && (
          <div className="mt-6">
            <button
              onClick={() => toggleView("recipes")}
              className={`px-4 py-2 mr-4 ${isRecipesView ? "font-black" : "font-normal"} text-2xl border-b-1 border-BGcolor text-black hover:border-b-1 hover:border-black`}
            >
              Recipes
            </button>
            <button
              onClick={() => toggleView("users")}
              className={`ml-4 px-4 py-2 ${!isRecipesView ? "font-black" : "font-normal"} text-2xl text-black hover:border-b-1`}
            >
              Users
            </button>
          </div>
        )}
      </div>

      {/* Display the active view (Recipes or Users) */}
      {isRecipesView ? (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {isOwnProfile ? "Dine oppskrifter" : `${userData?.displayName}'s oppskrifter`}
          </h2>
          {userRecipes.length === 0 ? (
            <p className="text-center text-gray-500">
              {isOwnProfile ? "Du har ingen oppskrifter" : "Denne brukeren har ingen oppskrifter."}
            </p>
          ) : (
            <div className="max-w-[1400px] mx-auto px-4">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none">
                {userRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={isOwnProfile ? () => console.log(`Edit recipe ${recipe.id}`) : null}
                    onDelete={isAdmin || isOwnProfile ? () => handleDeleteRecipe(recipe.id) : null}
                    isAdmin={isAdmin}
                    isOwnProfile={isOwnProfile}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        isAdmin && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Alle brukere</h2>
            {userList.length === 0 ? (
              <p className="text-center text-gray-500">Ingen brukere funnet</p>
            ) : (
              <ul className="px-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userList.map((user) => (
                  <li
                    key={user.id}
                    className="mb-2 p-2 text-center cursor-pointer hover:bg-Secondary flex flex-row items-center justify-center border-1 border-Secondary"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <p
                    className="w-2/3"
                    >{user.displayName}</p>
                    <img
                    src={user.avatarUrl}
                    className="ml-4 w-16 h-16 object-cover rounded-full border-1 border-BGwhite"
                    ></img>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      )}
    </div>
    
  );
}