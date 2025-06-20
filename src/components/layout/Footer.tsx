
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  const customerCareLinks = [
    { label: 'Contact Us', href: '#' },
    { label: 'Shipping & Returns', href: '#' },
    { label: 'Size Guide', href: '#' },
    { label: 'Care Instructions', href: '#' },
    { label: 'FAQ', href: '#' },
  ];

  const aboutLinks = [
    { label: 'Our Story', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Sustainability', href: '#' },
    { label: 'Store Locator', href: '#' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Accessibility', href: '#' },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-serif font-light mb-4">
              Restez Connecté
            </h3>
            <p className="text-slate-300 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir les dernières nouvelles, 
              offres exclusives et aperçus des nouvelles collections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Votre adresse email"
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
              <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-serif font-bold mb-6">LUCCY BY EY</h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              L'élégance française redéfinie. Découvrez notre collection exclusive 
              de pièces intemporelles qui allient sophistication et modernité.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <Phone className="w-4 h-4 mr-3" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail className="w-4 h-4 mr-3" />
                <span>contact@luccybyey.fr</span>
              </div>
              <div className="flex items-center text-slate-300">
                <MapPin className="w-4 h-4 mr-3" />
                <span>75008 Paris, France</span>
              </div>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-medium mb-6">Service Client</h4>
            <ul className="space-y-3">
              {customerCareLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg font-medium mb-6">À Propos</h4>
            <ul className="space-y-3">
              {aboutLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="text-lg font-medium mb-6">Suivez-nous</h4>
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="space-y-3">
              {legalLinks.map((link, index) => (
                <div key={index}>
                  <a 
                    href={link.href} 
                    className="text-slate-400 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2024 Luccy By Ey. Tous droits réservés.</p>
            <p>Conçu avec passion à Paris</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
