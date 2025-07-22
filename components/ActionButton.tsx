
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-36 h-36 rounded-full bg-cyan-500 text-white font-bold text-lg
                 flex items-center justify-center
                 transition-all duration-300 ease-in-out
                 transform active:scale-90
                 shadow-lg hover:shadow-cyan-400/50
                 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
    >
      SEND
    </button>
  );
};
