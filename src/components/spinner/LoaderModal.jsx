import React, { useState } from "react";
import BurgerGame from "./PacManGame";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg relative">
        {/* Lukke-knapp */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 text-xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default function LoaderModal() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={() => setModalOpen(true)}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Åpne Loader Modal
      </button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {/* Her vises BurgerGame som fungerer som en loader */}
        <BurgerGame />
      </Modal>
    </div>
  );
}
