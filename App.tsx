import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePeer } from './hooks/usePeer';
import { generateStatusMessage } from './services/geminiService';
import { Light } from './components/Light';
import { ActionButton } from './components/ActionButton';
import { StatusDisplay } from './components/StatusDisplay';
import { ConnectionForm } from './components/ConnectionForm';
import type { PeerData } from './types';

export default function App() {
  const [channelId, setChannelId] = useState('');
  const [isLightOn, setIsLightOn] = useState(false);
  const [status, setStatus] = useState('Enter a code to connect.');
  const [geminiMessage, setGeminiMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPeerJsReady, setIsPeerJsReady] = useState(false);

  useEffect(() => {
    const checkPeerJs = () => {
      if ((window as any).Peer) {
        setIsPeerJsReady(true);
        return true;
      }
      return false;
    };

    if (checkPeerJs()) {
      return;
    }

    const intervalId = setInterval(() => {
      if (checkPeerJs()) {
        clearInterval(intervalId);
      }
    }, 100); 

    return () => clearInterval(intervalId);
  }, []);

  const handleDataReceived = useCallback(async (data: PeerData) => {
    if (data.type === 'TOGGLE_LIGHT') {
      setIsLightOn(prevIsLightOn => {
        const newLightState = !prevIsLightOn;
        if (newLightState) {
          setGeminiMessage('Your friend is sending a signal...');
          generateStatusMessage('on').then(setGeminiMessage);
        } else {
          setGeminiMessage('Light turned off.');
        }
        return newLightState;
      });
    }
  }, []);
  
  const { peerId, isConnected, connect, sendMessage, error } = usePeer(handleDataReceived);

  useEffect(() => {
    if (isConnected) {
      setIsConnecting(false);
      setStatus(`Connected with a friend! Your ID: ${peerId}`);
      setGeminiMessage('Press the button to send a signal.');
    }
  }, [isConnected, peerId]);

  useEffect(() => {
    if (error) {
      setIsConnecting(false);
      setStatus(error);
      setGeminiMessage('Please check the connection code or try a new one.');
    }
  }, [error]);

  const handleConnect = () => {
    if (channelId.trim()) {
      setIsConnecting(true);
      setStatus(`Connecting to channel: ${channelId}...`);
      setGeminiMessage('');
      connect(channelId.trim());
    }
  };

  const handleButtonClick = useCallback(() => {
    if (isConnected) {
      sendMessage({ type: 'TOGGLE_LIGHT' });
      setIsLightOn(prev => {
        const newLightState = !prev;
        if (newLightState) {
          setGeminiMessage('Signal sent! Waiting for a witty reply...');
        } else {
          setGeminiMessage('Light turned off.');
        }
        return newLightState;
      });
    }
  }, [isConnected, sendMessage]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-900 text-gray-100 font-sans">
      <div className="w-full max-w-sm mx-auto text-center">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-400">Connected Lights</h1>
        </header>
        
        {!isConnected ? (
          <ConnectionForm
            channelId={channelId}
            setChannelId={setChannelId}
            handleConnect={handleConnect}
            isConnecting={isConnecting}
            isPeerJsReady={isPeerJsReady}
          />
        ) : (
          <main className="flex flex-col items-center justify-center space-y-12">
            <Light isOn={isLightOn} />
            <ActionButton onClick={handleButtonClick} disabled={!isConnected} />
          </main>
        )}

        <footer className="mt-8">
          <StatusDisplay status={status} geminiMessage={geminiMessage} />
        </footer>
      </div>
    </div>
  );
}