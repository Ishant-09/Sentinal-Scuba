import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../api/client';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface SocketContextValue {
  socket: Socket | null;
  status: ConnectionStatus;
  reconnect: () => void;
  emit: (event: string, data?: any, callback?: any) => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  status: 'disconnected',
  reconnect: () => {},
  emit: () => {}
});

export const useSocket = () => useContext(SocketContext);

/**
 * Hook to listen to a specific socket event with automatic cleanup
 */
export function useSocketEvent<T = any>(event: string, handler: (data: T) => void) {
  const { socket } = useSocket();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket) return;
    const listener = (data: T) => {
      handlerRef.current(data);
    };
    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, [socket, event]);
}

interface SocketProviderProps {
  children: React.ReactNode;
  onEvent?: (event: string, data: any) => void;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, onEvent }) => {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const initSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const token = getAccessToken();
    const newSocket = io({
      path: '/socket.io',
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 15,
      reconnectionDelay: 1000
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setStatus('connected');
      newSocket.emit('sync:resume', {}, () => {});
    });

    newSocket.on('disconnect', () => {
      setStatus('disconnected');
    });

    newSocket.on('connect_error', () => {
      setStatus('disconnected');
    });

    // Wire universal event dispatcher if callback passed
    const coreEvents = [
      'presence:update',
      'user:stats',
      'xp:gained',
      'level:up',
      'quest:progress',
      'guild:stats',
      'guild:activity',
      'leaderboard:update',
      'chat:message',
      'chat:reaction',
      'chat:typing',
      'whisper:new',
      'whisper:typing',
      'whisper:read',
      'boss:hit',
      'boss:phase',
      'boss:defeated',
      'study:room',
      'study:participants',
      'study:timer',
      'study:ended',
      'notification:new',
      'achievement:unlocked',
      'session:revoked'
    ];

    for (const evt of coreEvents) {
      newSocket.on(evt, (data) => {
        onEventRef.current?.(evt, data);
      });
    }
  }, []);

  const emit = useCallback((event: string, data?: any, callback?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data, callback);
    }
  }, []);

  useEffect(() => {
    initSocket();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [initSocket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        status,
        reconnect: initSocket,
        emit
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
