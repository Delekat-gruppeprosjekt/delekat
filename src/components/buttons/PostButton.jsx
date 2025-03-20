import React from "react";

export default function PostButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-600 text-white py-1 px-3 rounded-lg hover:bg-green-700 transition duration-200 max-w-[100px] w-full sm:w-auto"
    >
      Post
    </button>
  );
}
