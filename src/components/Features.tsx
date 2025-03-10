
import { useState } from 'react';
import AnimatedCard from './AnimatedCard';
import { Layers, PenTool, Shield, BarChart3, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: PenTool,
    title: 'Thoughtful Design',
    description: 'Every pixel has been placed with precision, creating an interface that feels intuitive and elegant.'
  },
  {
    icon: Layers,
    title: 'Seamless Integration',
    description: 'Built to work perfectly with your existing ecosystem, providing a cohesive experience.'
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'Security is not an afterthought. Your data is protected by modern security protocols.'
  },
  {
    icon: BarChart3,
    title: 'Insightful Analytics',
    description: 'Gain valuable insights with powerful analytics that help you make informed decisions.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for performance, delivering a responsive experience even in challenging conditions.'
  },
  {
    icon: Sparkles,
    title: 'Premium Experience',
    description: 'Delightful interactions and thoughtful details that make using our product a joy.'
  }
];

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Meticulously crafted for <span className="text-gradient">excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Every feature has been designed with intention, focusing on what truly matters to deliver an exceptional experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <AnimatedCard 
              key={index}
              className={cn(
                "feature-card glass-card rounded-xl p-6 transition-all duration-500",
                hoveredFeature !== null && hoveredFeature !== index ? 'opacity-80' : 'opacity-100'
              )}
              intensity={3}
            >
              <div 
                className="h-full flex flex-col"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="feature-icon-wrapper bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
