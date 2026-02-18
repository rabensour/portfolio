import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { StateIndicator } from './StateIndicator';
import type { Message, UserState } from '@/types/chat';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentState, setCurrentState] = useState<UserState>(null);
  const { sendMessage, isConnected, isTyping, error } = useWebSocket('/ws/chat');

  const handleSend = async (content: string) => {
    // Add user message optimistically
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Send via WebSocket and wait for response
      const response = await sendMessage(content);

      // Add coach response
      const coachMsg: Message = {
        id: crypto.randomUUID(),
        role: 'coach',
        content: response.response,
        state: response.state,
        timestamp: response.timestamp,
      };
      setMessages((prev) => [...prev, coachMsg]);
      setCurrentState(response.state);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Add error message
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'coach',
        content: "Désolé, une erreur s'est produite. Vérifie que le serveur API est lancé.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleNewSession = () => {
    if (confirm('Créer une nouvelle session ? La conversation actuelle sera sauvegardée.')) {
      setMessages([]);
      setCurrentState(null);
      // TODO: Call API to create new session
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Second Cerveau</h1>
            {currentState && <StateIndicator state={currentState} />}
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`} />
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </div>
            <button
              onClick={handleNewSession}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Nouvelle session
            </button>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <p className="text-sm text-red-800 max-w-4xl mx-auto">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Messages */}
      <MessageList messages={messages} isTyping={isTyping} />

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={!isConnected} isTyping={isTyping} />
    </div>
  );
}
