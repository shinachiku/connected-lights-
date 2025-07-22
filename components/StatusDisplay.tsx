
import React from 'react';

interface StatusDisplayProps {
  status: string;
  geminiMessage: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, geminiMessage }) => {
  return (
    <div className="h-24 flex flex-col justify-center items-center space-y-2 p-4 bg-gray-800/50 rounded-lg">
      <p className="text-sm text-gray-400 font-mono">{status}</p>
      {geminiMessage && (
        <p className="text-lg text-teal-300 animate-pulse">{geminiMessage}</p>
      )}
    </div>
  );
};
