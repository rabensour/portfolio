import { useState, useEffect } from 'react';
import type { ChatMessage } from '../../types/astro';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { sendMessage } from '../../services/claudeApi';
import { storage } from '../../services/storage';

interface ChatInterfaceProps {
  apiKey: string;
}

export function ChatInterface({ apiKey }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = storage.loadConversation();
    if (saved) {
      setMessages(saved);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      storage.saveConversation(messages);
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage([...messages, userMessage], apiKey);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer la conversation ?')) {
      setMessages([]);
      storage.clearConversation();
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-cosmic-deep rounded-xl border-2 border-cosmic-blue shadow-2xl">
      <div className="p-5 border-b-2 border-cosmic-blue flex justify-between items-center bg-gradient-to-r from-cosmic-deep to-cosmic-blue">
        <h2 className="text-2xl font-bold text-celestial-gold">✨ Assistant Astrologique</h2>
        <button
          onClick={handleClear}
          className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-cosmic-dark"
        >
          🗑️ Effacer
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <MessageList messages={messages} />
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-900/30 text-red-300 text-sm border-t-2 border-red-800">
          ⚠️ Erreur: {error}
        </div>
      )}

      <div className="p-5 border-t-2 border-cosmic-blue bg-cosmic-blue/30">
        <MessageInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
