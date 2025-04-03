import React from "react";

export default function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-btn text-BGwhite py-1 px-3 rounded-lg hover:bg-blue-btn-hover transition duration-200 max-w-[100px] w-full sm:w-auto"
    >
      Rediger
    </button>
  );
}
