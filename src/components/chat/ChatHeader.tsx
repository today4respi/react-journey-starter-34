import React from 'react';
import { User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  agentsOnline: boolean;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ agentsOnline, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-primary via-accent to-primary p-4 flex items-center justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-white font-semibold block">Assistant Luxe</span>
          <span className="text-white/80 text-xs">{agentsOnline ? 'En ligne' : 'Hors ligne'}</span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClose} 
        className="text-white hover:bg-white/20 h-8 w-8 p-0 relative z-10"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};