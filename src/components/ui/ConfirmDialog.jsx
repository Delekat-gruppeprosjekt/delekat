import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoWarning } from "react-icons/io5";

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <IoWarning className="text-red-btn text-2xl flex-shrink-0" />
            <p className="text-lg font-medium">{message}</p>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-btn rounded-md hover:bg-red-btn-hover transition-colors"
            >
              Slett
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;