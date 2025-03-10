
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  // Implement lazy loading of sections with fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Product showcase section */}
      <section id="products" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/50 pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll [animation-delay:0.2s] [animation-fill-mode:forwards]">
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                Product
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Crafted with attention to <span className="text-gradient">every detail</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our product embodies the philosophy that great design is not just about how it looks, but how it works. 
                Every interaction has been thoughtfully considered to create a seamless experience.
              </p>
              
              <ul className="space-y-4 mb-8">
                {['Intuitive interface', 'Responsive design', 'Accessible to everyone', 'Optimized performance'].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1 mr-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative animate-on-scroll [animation-delay:0.4s] [animation-fill-mode:forwards]">
              <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden glass-card p-5">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Product Placeholder</h3>
                    <p className="text-sm text-muted-foreground">
                      Visual representation of our beautiful product
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-100 rounded-full" />
              <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-primary/10 rounded-full" />
              <div className="absolute top-1/2 -right-4 w-8 h-8 bg-primary/20 rounded-full" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              Contact Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to get <span className="text-gradient">started?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Reach out to us today and let's create something amazing together. 
              Our team is ready to help you bring your vision to life.
            </p>
            
            <div className="glass-card p-8 rounded-xl">
              <form className="text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Your message"
                  />
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    className="relative overflow-hidden transition-all duration-300 ease-out group active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-6 after:absolute after:inset-0 after:bg-white/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
                  >
                    <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                      Send Message
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
