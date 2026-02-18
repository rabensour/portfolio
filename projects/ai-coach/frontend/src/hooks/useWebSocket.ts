import { useEffect, useRef, useState, useCallback } from 'react';
import type { ChatResponse } from '@/types/chat';

interface UseWebSocketReturn {
  sendMessage: (message: string) => Promise<ChatResponse>;
  isConnected: boolean;
  isTyping: boolean;
  error: string | null;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageResolver = useRef<((value: ChatResponse) => void) | null>(null);

  useEffect(() => {
    const wsUrl = `ws://localhost:8000${url}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      setError(null);
      console.log('WebSocket connected');
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    ws.current.onerror = (event) => {
      setError('WebSocket connection error');
      console.error('WebSocket error:', event);
    };

    ws.current.onmessage = (event) => {
      setIsTyping(false);
      const data = JSON.parse(event.data);

      if (data.error) {
        setError(data.error);
        return;
      }

      if (messageResolver.current) {
        messageResolver.current(data);
        messageResolver.current = null;
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: string): Promise<ChatResponse> => {
    return new Promise((resolve, reject) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      setIsTyping(true);
      setError(null);
      messageResolver.current = resolve;

      try {
        ws.current.send(JSON.stringify({ message }));
      } catch (err) {
        setIsTyping(false);
        setError('Failed to send message');
        reject(err);
      }
    });
  }, []);

  return {
    sendMessage,
    isConnected,
    isTyping,
    error,
  };
}
