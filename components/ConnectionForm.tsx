import React from 'react';

interface ConnectionFormProps {
  channelId: string;
  setChannelId: (id: string) => void;
  handleConnect: () => void;
  isConnecting: boolean;
  isPeerJsReady: boolean;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ channelId, setChannelId, handleConnect, isConnecting, isPeerJsReady }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConnect();
  };
  
  const isButtonDisabled = !isPeerJsReady || isConnecting || !channelId.trim();
  let buttonText = 'Connect';
  if (!isPeerJsReady) {
    buttonText = 'Initializing...';
  } else if (isConnecting) {
    buttonText = 'Connecting...';
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <input
        type="text"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
        placeholder="Enter connection code"
        className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-center text-white focus:outline-none focus:border-cyan-400 transition-colors"
        disabled={!isPeerJsReady || isConnecting}
      />
      <button
        type="submit"
        className="w-full py-3 px-4 bg-green-500 text-white font-bold rounded-lg
                   transition-transform transform hover:scale-105 active:scale-100
                   disabled:bg-gray-500 disabled:cursor-wait"
        disabled={isButtonDisabled}
      >
        {buttonText}
      </button>
    </form>
  );
};