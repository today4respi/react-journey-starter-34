
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AnimatedButton from './AnimatedButton';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-12',
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="text-xl font-semibold tracking-tight transition-colors">
          <span className={cn(
            'transition-colors duration-300',
            scrolled ? 'text-foreground' : 'text-foreground'
          )}>
            Purity
          </span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Home', 'Features', 'Products', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={cn(
                'text-sm font-medium transition-all duration-300 hover:text-primary relative',
                'after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary',
                'after:transition-all after:duration-300 hover:after:w-full',
                scrolled ? 'text-foreground' : 'text-foreground'
              )}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <AnimatedButton size="sm" className="px-5">
            Get Started
          </AnimatedButton>
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-foreground p-2 focus:outline-none transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={cn(
          'fixed inset-0 bg-background/98 backdrop-blur-sm z-40 md:hidden pt-20 px-6 transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col space-y-6 items-center">
          {['Home', 'Features', 'Products', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-foreground transition-colors hover:text-primary"
            >
              {item}
            </a>
          ))}
          <AnimatedButton className="w-full mt-4">
            Get Started
          </AnimatedButton>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
