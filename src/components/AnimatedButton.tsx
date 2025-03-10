
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const AnimatedButton = ({ 
  variant = 'default', 
  size = 'default', 
  children, 
  className,
  ...props 
}: AnimatedButtonProps) => {
  return (
    <Button 
      variant={variant}
      size={size}
      className={cn(
        'relative overflow-hidden transition-all duration-300 ease-out group active:scale-95',
        'after:absolute after:inset-0 after:bg-white/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity',
        className
      )}
      {...props}
    >
      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
        {children}
      </span>
    </Button>
  );
};

export default AnimatedButton;
