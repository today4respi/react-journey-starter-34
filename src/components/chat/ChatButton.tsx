import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatButtonProps {
  agentsOnline: boolean;
  unreadCount: number;
  onClick: () => void;
  isMobile?: boolean;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ 
  agentsOnline, 
  unreadCount, 
  onClick, 
  isMobile = false 
}) => {
  return (
    <Button 
      onClick={onClick} 
      size="lg" 
      className={cn(
        "rounded-full bg-gradient-to-r from-primary via-accent to-primary shadow-xl ring-4 ring-primary/20",
        isMobile ? "w-14 h-14" : "w-16 h-16"
      )}
    >
      <div className="relative">
        <User className={cn("text-white", isMobile ? "w-5 h-5" : "w-6 h-6")} />
        
        {/* Online status indicator */}
        <div className={cn(
          "absolute rounded-full border-2 border-white",
          isMobile ? "-top-1 -right-1 w-2 h-2 border" : "-top-2 -right-2 w-3 h-3",
          agentsOnline ? "bg-green-400 animate-pulse" : "bg-red-400"
        )}></div>
        
        {/* Unread message badge */}
        {unreadCount > 0 && (
          <div className={cn(
            "absolute bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold border-white animate-pulse",
            isMobile 
              ? "-top-1 -left-1 w-4 h-4 border" 
              : "-top-2 -left-2 w-5 h-5 border-2"
          )}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>
    </Button>
  );
};