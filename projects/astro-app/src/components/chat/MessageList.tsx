import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types/astro';

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
        <div className="text-6xl">🌙</div>
        <p className="text-center text-lg">Posez votre première question sur votre thème astral...</p>
        <p className="text-sm text-gray-500">L'assistant analysera votre carte du ciel pour vous répondre</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-lg ${
              message.role === 'user'
                ? 'bg-gradient-to-br from-mystic-purple to-mystic-light text-white'
                : 'bg-gradient-to-br from-cosmic-blue to-cosmic-deep text-moon-silver border border-cosmic-blue'
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            <div className="text-xs opacity-60 mt-3 text-right">
              {message.timestamp.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
