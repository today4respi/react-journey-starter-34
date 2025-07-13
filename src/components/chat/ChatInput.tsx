import React from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onKeyDown,
  disabled = false
}) => {
  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tapez votre message..."
            className="h-12 px-4 py-3 rounded-full text-sm transition-all duration-200"
            autoComplete="off"
            disabled={disabled}
          />
        </div>
        
        <button
          type="button"
          onClick={onSendMessage}
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};