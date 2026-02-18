import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isTyping?: boolean;
}

export function ChatInput({ onSend, disabled = false, isTyping = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled && !isTyping) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex gap-2 max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={isTyping ? "Le coach réfléchit..." : "Écris ton message..."}
          disabled={disabled || isTyping}
          className="flex-1 resize-none rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows={1}
          style={{ maxHeight: '200px' }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isTyping}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Envoyer
        </button>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        Appuie sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
      </p>
    </div>
  );
}
