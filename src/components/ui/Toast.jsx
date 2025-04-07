import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoWarning } from "react-icons/io5";

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <IoMdCheckmarkCircle className="text-2xl" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'error':
        return {
          icon: <IoWarning className="text-2xl" />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <IoMdCheckmarkCircle className="text-2xl" />,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
    }
  };

  const { icon, bgColor, textColor, borderColor } = getToastStyles();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 min-w-[300px] max-w-md
                   ${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg border ${borderColor}
                   flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoMdClose className="text-xl" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;