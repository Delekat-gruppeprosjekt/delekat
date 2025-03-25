import React, { useState, useEffect } from "react";
import { PiMagnifyingGlass } from "react-icons/pi";
import HomeList from "../../components/home/HomeList.jsx";
import { firestore } from "../../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(firestore, "posts");
        const q = query(postsCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            _id: doc.id,
            ...docData,
            createdAt: docData.createdAt?.toDate() || new Date(),
          };
        });

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="min-h-screen p-6 bg-[var(--color-BGcolor)]">
      <div className="flex items-center justify-start ml-1">
        <img
          src="/assets/DelekatLogo.svg"
          alt="Delekat Logo"
          loading="lazy"
          className="h-auto w-22"
        />
      </div>

      <h1 className="text-3xl font-thin mb-6 flex justify-center mt-8">
        La deg friste
      </h1>

      {/* Search Icon */}
      <div
        className="absolute right-0 top-0 m-8 text-2xl hover:scale-110 duration-150 cursor-pointer"
        onClick={() => setShowSearch(!showSearch)}
      >
        <PiMagnifyingGlass />
      </div>

      {/* Search Input */}
      {showSearch && (
        <div className="flex justify-center">
          <input
            className="bg-BGwhite w-2/4 p-2 rounded-lg mb-6 outline-0"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Søk"
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center w-full">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          >
            <span className="sr-only">Laster...</span>
          </div>
        </div>
      ) : (
        <HomeList posts={posts} searchQuery={searchQuery} />
      )}
    </div>
  );
}
