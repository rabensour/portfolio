import { useState, type KeyboardEvent } from 'react';
import { Button } from '../ui/Button';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSend, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-end">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Posez votre question astrologique..."
        className="flex-1 bg-cosmic-deep text-white rounded-xl px-5 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-mystic-purple min-h-[60px] max-h-[120px] border border-cosmic-blue transition-all"
        rows={2}
        disabled={isLoading}
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        variant="primary"
        className="h-[60px] px-6"
      >
        {isLoading ? '⏳' : '📤 Envoyer'}
      </Button>
    </div>
  );
}
