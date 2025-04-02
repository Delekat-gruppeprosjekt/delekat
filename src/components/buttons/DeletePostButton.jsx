import React from "react";

export default function DeletePostButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-btn text-BGwhite py-1 px-3 rounded-lg hover:bg-red-btn-hover transition duration-200 max-w-[100px] w-full sm:w-auto"
    >
      Slett
    </button>
  );
}
