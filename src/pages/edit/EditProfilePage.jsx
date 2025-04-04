import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Spinner2Burger from "../../components/spinner/Spinner2Burger.jsx";

export default function EditProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarError, setAvatarError] = useState(null);

  useEffect(() => {
    if (auth.currentUser?.uid !== userId) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setAvatarUrl(data.avatarUrl || "");
          setBio(data.bio || "");
        } else {
          setError("User not found!");
        }
      } catch (err) {
        setError("Error fetching user data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, db, auth, navigate]);

  const validateImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleSaveChanges = async () => {
    const isValidImage = await validateImageUrl(avatarUrl);
    if (!isValidImage) {
      setAvatarError("URL-en peker ikke til et gyldig bilde.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        avatarUrl,
        bio,
        updatedAt: new Date(),
      });
      navigate(`/profile/${userId}`);
    } catch (err) {
      setError("Error saving changes: " + err.message);
    }
  };

  if (loading) {
    return <Spinner2Burger />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="max-w-3xl mx-auto bg-BGwhite rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-6">Rediger Profil</h1>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-semibold" htmlFor="avatarUrl">
            Avatar URL
          </label>
          <input
            type="text"
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => {
              setAvatarUrl(e.target.value);
              setAvatarError(null);
            }}
            className="w-full p-2 border border-PMgreen rounded-md"
            placeholder="Fyll inn avatar URL"
          />
          {avatarError && <p className="text-red-btn">{avatarError}</p>}
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-semibold" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => {
              if (e.target.value.length <= 150) {
                setBio(e.target.value);
              }
            }}
            className="w-full p-2 border border-PMgreen rounded-md"
            rows="4"
            placeholder="Skriv en Bio (max 150 tegn)"
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">{bio.length}/150 Tegn</p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate(`/profile/${userId}`)}
            className="px-4 py-2 bg-gray-500 text-BGwhite rounded-lg hover:bg-gray-600"
          >
            Avbryt
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-green-btn text-BGwhite rounded-lg hover:bg-green-btn-hover"
          >
            Oppdater profil
          </button>
        </div>
      </div>
    </div>
  );
}
