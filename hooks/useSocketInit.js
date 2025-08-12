'use client';

import { useEffect } from 'react';

export const useSocketInit = () => {
  useEffect(() => {
    // Initialize Socket.IO server
    const initSocket = async () => {
      try {
        await fetch('/api/socket');
        console.log('Socket.IO server initialized');
      } catch (error) {
        console.error('Failed to initialize Socket.IO:', error);
      }
    };

    initSocket();
  }, []);
};
