import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  text: string;
  isUser: boolean;
  imageUrl?: string;
  imageName?: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/30">
      {messages.slice().reverse().map((msg, index) => (
        <div key={index} className={cn("flex gap-2 items-start", msg.isUser ? "flex-row-reverse" : "flex-row")}>
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", msg.isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-r from-accent to-primary text-white")}>
            {msg.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          <div className={cn("max-w-[75%] rounded-2xl text-sm shadow-sm", msg.isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-white text-foreground border border-border rounded-tl-sm")}>
            {msg.imageUrl ? (
              <div className="p-2">
                <img 
                  src={msg.imageUrl} 
                  alt={msg.imageName || "Image partagée"} 
                  className="max-w-full max-h-48 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(msg.imageUrl, '_blank')}
                  loading="lazy"
                />
                {msg.text && <p className="mt-2 p-2">{msg.text}</p>}
              </div>
            ) : (
              <div className="p-3">{msg.text}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};