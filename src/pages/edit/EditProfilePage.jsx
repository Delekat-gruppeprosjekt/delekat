import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [userId, db]);

  const handleSaveChanges = async () => {
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-semibold" htmlFor="avatarUrl">
            Avatar URL
          </label>
          <input
            type="text"
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter avatar URL"
          />
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
            className="w-full p-2 border rounded-md"
            rows="4"
            placeholder="Write your bio (max 150 characters)"
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">
            {bio.length}/150 characters
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate(`/profile/${userId}`)}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
