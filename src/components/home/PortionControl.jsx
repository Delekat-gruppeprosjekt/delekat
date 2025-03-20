import React, { useState } from 'react';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';

export default function PortionControl({ onPortionChange }) {
  const [portions, setPortions] = useState(1);
  const [highlight, setHighlight] = useState(false);

  const handleDecrease = () => {
    if (portions > 1) {
      const newPortions = portions - 1;
      setPortions(newPortions);
      onPortionChange(newPortions);
    }
  };

  const handleIncrease = () => {
    const newPortions = portions + 1;
    setPortions(newPortions);
    onPortionChange(newPortions);
    setHighlight(true);
    setTimeout(() => {
      setHighlight(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-m font-medium mb-2">Porsjoner</p>
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleDecrease}
          className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:text-[var(--color-PMgreen)]"
        >
          <CiCircleMinus size={38} />
        </button>
        <span
          className={`text-2xl font-regular transition-colors duration-300 ${
            highlight ? 'text-[var(--color-SGgreen)]' : ''
          }`}
        >
          {portions}
        </span>
        <button
          onClick={handleIncrease}
          className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:text-[var(--color-PMgreen)]"
        >
          <CiCirclePlus size={38} />
        </button>
      </div>
    </div>
  );
}
