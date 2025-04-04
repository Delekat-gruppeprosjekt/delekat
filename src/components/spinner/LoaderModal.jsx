import React, { useState } from "react";
import BurgerGame from "./PacManGame";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg relative">
     
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold bg-red-500 px-2 py-1 rounded"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default function LoaderModal() {
  // Åpner modalen direkte
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
      
        <BurgerGame />
      </Modal>
    </div>
  );
}
