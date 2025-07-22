
import { useState, useEffect, useRef, useCallback } from 'react';
import type { PeerData } from '../types';

const CONNECTION_TIMEOUT = 60000; // 1 minute

export const usePeer = (onDataReceived: (data: PeerData) => void) => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerRef = useRef<any>(null);
  const connRef = useRef<any>(null);
  const onDataReceivedRef = useRef(onDataReceived);
  const connectionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    onDataReceivedRef.current = onDataReceived;
  }, [onDataReceived]);
  
  const cleanup = useCallback(() => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    if (connRef.current) {
        connRef.current.close();
        connRef.current = null;
    }
  }, []);

  const connect = useCallback((channelId: string) => {
    cleanup();
    setError(null);

    const Peer = (window as any).Peer;

    if (!Peer) {
      setError("Connection library not ready. Please try again in a moment.");
      console.error('PeerJS is not loaded yet.');
      return;
    }

    connectionTimeoutRef.current = window.setTimeout(() => {
        setError('Connection timed out after 1 minute. Please try a different code.');
        setIsConnected(false);
        cleanup();
    }, CONNECTION_TIMEOUT);

    try {
      const newPeer = new Peer(channelId, {
        // In a real production app, you would host your own PeerServer.
      });
      peerRef.current = newPeer;

      const setupConnectionEvents = (conn: any) => {
        if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
        }
        connRef.current = conn;
        conn.on('open', () => {
          setIsConnected(true);
        });
        conn.on('data', (data: PeerData) => {
          onDataReceivedRef.current(data);
        });
        conn.on('close', () => {
          setIsConnected(false);
          setError('Friend disconnected.');
          cleanup();
        });
         conn.on('error', (err: any) => {
          console.error('Connection error:', err);
          setError(`Connection error: ${err.type}.`);
          cleanup();
        });
      };

      newPeer.on('open', (id: string) => {
        setPeerId(id);
        setError(null);
      });

      // Handle incoming connections (for the first peer)
      newPeer.on('connection', (conn: any) => {
        setupConnectionEvents(conn);
      });

      // Handle errors
      newPeer.on('error', (err: any) => {
        if (err.type === 'unavailable-id') {
          // This means the ID is taken, so we are the second peer. Let's connect to the first.
          const conn = newPeer.connect(channelId);
          setupConnectionEvents(conn);
        } else {
          console.error('PeerJS error:', err);
          setError(`Connection error: ${err.type}. Try a different code.`);
          setIsConnected(false);
          cleanup();
        }
      });

    } catch (e) {
        setError("Could not initialize connection. Is PeerJS loaded?");
        console.error(e);
        cleanup();
    }
  }, [cleanup]);

  const sendMessage = useCallback((data: PeerData) => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send(data);
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return { peerId, isConnected, connect, sendMessage, error };
};
