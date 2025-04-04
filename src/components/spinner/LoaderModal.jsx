import React, { useState } from "react";
import BurgerGame from "./PacManGame";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl relative">
     
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-black text-2xl font-bold flex items-center justify-center shadow-md transition-all duration-200 ease-in-out transform hover:scale-110 hover:bg-red-500 hover:border-red-500 hover:text-white hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default function LoaderModal() {

  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {/* Her vises BurgerGame som fungerer som en loader */}
        <BurgerGame />
      </Modal>
    </div>
  );
}
