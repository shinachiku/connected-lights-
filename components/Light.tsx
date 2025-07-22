
import React from 'react';

interface LightProps {
  isOn: boolean;
}

export const Light: React.FC<LightProps> = ({ isOn }) => {
  const baseClasses = "w-48 h-48 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center";
  const onClasses = "bg-yellow-300 shadow-[0_0_20px_5px_rgba(252,242,102,0.7),_0_0_40px_20px_rgba(252,242,102,0.5)]";
  const offClasses = "bg-gray-700 shadow-inner";

  return (
    <div className={`${baseClasses} ${isOn ? onClasses : offClasses}`}>
       <div className={`w-40 h-40 rounded-full ${isOn ? 'bg-yellow-200' : 'bg-gray-600'} transition-colors duration-500`}></div>
    </div>
  );
};
