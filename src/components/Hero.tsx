
import { useEffect, useRef } from 'react';
import AnimatedButton from './AnimatedButton';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage of viewport
      const moveX = (clientX / innerWidth) - 0.5;
      const moveY = (clientY / innerHeight) - 0.5;
      
      // Apply parallax effect to elements with data-depth attribute
      const elements = heroRef.current.querySelectorAll('[data-depth]');
      elements.forEach(el => {
        const depth = parseFloat((el as HTMLElement).dataset.depth || '0');
        const translateX = moveX * depth * 40;
        const translateY = moveY * depth * 40;
        (el as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 hero-gradient" />
      <div data-depth="0.2" className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl" />
      <div data-depth="0.1" className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-200/10 rounded-full filter blur-3xl" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block animate-fade-up opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards] bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            Introducing our vision for the future
          </span>
          
          <h1 className="animate-fade-up opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards] text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-balance mb-6">
            <span className="text-foreground inline-block">Design that </span>
            <span className="text-gradient inline-block">inspires.</span>
            <span className="text-foreground inline-block"> Simplicity that </span>
            <span className="text-gradient inline-block">performs.</span>
          </h1>
          
          <p className="animate-fade-up opacity-0 [animation-delay:0.6s] [animation-fill-mode:forwards] text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            A premium experience focused on simplicity, clarity, and functionality. 
            Every element has been thoughtfully designed to create a seamless user journey.
          </p>
          
          <div className="animate-fade-up opacity-0 [animation-delay:0.8s] [animation-fill-mode:forwards] flex flex-col sm:flex-row items-center justify-center gap-4">
            <AnimatedButton size="lg" className="px-8">
              Get Started
            </AnimatedButton>
            <AnimatedButton variant="outline" size="lg" className="group">
              <span>Learn more</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </AnimatedButton>
          </div>
        </div>
      </div>
      
      {/* Mouse scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-fade-up opacity-0 [animation-delay:1.2s] [animation-fill-mode:forwards]">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-foreground/50 rounded-full animate-float" />
        </div>
        <span className="text-xs text-foreground/50 mt-2">Scroll to explore</span>
      </div>
    </section>
  );
};

export default Hero;
