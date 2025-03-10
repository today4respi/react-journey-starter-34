
import { cn } from '@/lib/utils';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          <div className="md:col-span-1 lg:col-span-1">
            <a href="#" className="text-xl font-semibold tracking-tight mb-6 block">
              Purity
            </a>
            <p className="text-muted-foreground max-w-xs mb-6">
              A premium experience focused on simplicity and functionality, creating a seamless user journey.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              {['About', 'Careers', 'Blog', 'Legal'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className={cn(
                      'text-muted-foreground hover:text-foreground transition-colors',
                      'inline-block hover:translate-x-[3px] transition-transform duration-300'
                    )}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              {['Pricing', 'Features', 'Integrations', 'Documentation'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className={cn(
                      'text-muted-foreground hover:text-foreground transition-colors',
                      'inline-block hover:translate-x-[3px] transition-transform duration-300'
                    )}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="space-y-3">
              {['Support', 'Sales', 'Community', 'Social Media'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className={cn(
                      'text-muted-foreground hover:text-foreground transition-colors',
                      'inline-block hover:translate-x-[3px] transition-transform duration-300'
                    )}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Purity. All rights reserved.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Terms', 'Privacy', 'Cookies'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
