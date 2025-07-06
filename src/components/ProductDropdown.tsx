import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductDropdownProps {
  isOpen: boolean;
  activeCategory: string | null;
  onClose: () => void;
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({ isOpen, activeCategory, onClose }) => {
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      onClose();
    }, 300);
    setCloseTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  const categories = {
    surMesure: {
      title: 'Sur Mesure',
      image: '/lovable-uploads/47f47df0-faf6-4178-8ae1-526655f4230c.png',
      url: '/category/surMesure',
      sections: [
        {
          title: 'Homme',
          items: [
            { name: 'Blazers', image: '/lovable-uploads/d96e264c-4c78-436f-8046-7b929a4d5ce8.png', url: '/category/surMesure/homme-blazers', itemgroup: 'blazers' },
            { name: 'Blousons', image: '/lovable-uploads/850ce6f3-3077-447e-a7d5-f634b4f1bf6c.png', url: '/category/surMesure/homme-blouson', itemgroup: 'blouson' },
            { name: 'Manteaux', image: '/lovable-uploads/47f47df0-faf6-4178-8ae1-526655f4230c.png', url: '/category/surMesure/homme-manteau', itemgroup: 'manteau' },
            { name: 'Djine', image: '/lovable-uploads/d96e264c-4c78-436f-8046-7b929a4d5ce8.png', url: '/category/surMesure/homme-djine', itemgroup: 'djine' },
            { name: 'Slack', image: '/lovable-uploads/850ce6f3-3077-447e-a7d5-f634b4f1bf6c.png', url: '/category/surMesure/homme-slack', itemgroup: 'slack' },
            { name: 'Pantalons', image: '/lovable-uploads/47f47df0-faf6-4178-8ae1-526655f4230c.png', url: '/category/surMesure/homme-pantalon', itemgroup: 'pantalon' }
          ]
        },
        {
          title: 'Femme',
          items: [
            { name: 'Chemises', image: '/lovable-uploads/d96e264c-4c78-436f-8046-7b929a4d5ce8.png', url: '/category/surMesure/femme-chemise', itemgroup: 'chemise' },
            { name: 'Costumes', image: '/lovable-uploads/850ce6f3-3077-447e-a7d5-f634b4f1bf6c.png', url: '/category/surMesure/femme-costume', itemgroup: 'costume' },
            { name: 'Blazers', image: '/lovable-uploads/47f47df0-faf6-4178-8ae1-526655f4230c.png', url: '/category/surMesure/femme-blazer', itemgroup: 'blazer' }
          ]
        }
      ]
    },
    pretAPorter: {
      title: 'Prêt à Porter',
      image: '/lovable-uploads/850ce6f3-3077-447e-a7d5-f634b4f1bf6c.png',
      url: '/category/pretAPorter',
      sections: [
        {
          title: 'Collections',
          items: [
            { name: 'Chemises', image: '/lovable-uploads/d96e264c-4c78-436f-8046-7b929a4d5ce8.png', url: '/category/pretAPorter/chemise', itemgroup: 'chemise' },
            { name: 'T-shirts', image: '/lovable-uploads/47f47df0-faf6-4178-8ae1-526655f4230c.png', url: '/category/pretAPorter/tshirt', itemgroup: 'tshirt' },
            { name: 'Polos', image: '/lovable-uploads/850ce6f3-3077-447e-a7d5-f634b4f1bf6c.png', url: '/category/pretAPorter/polo', itemgroup: 'polo' },
            { name: 'Chaussures', image: '/lovable-uploads/d96e264c-4c78-436f-8046-7b929a4d5ce8.png', url: '/category/pretAPorter/chaussure', itemgroup: 'chaussure' },
            { name: 'Ceintures', image: '/lovable-uploads/47f47df0-faf6-4178-8ae1-526655f4230c.png', url: '/category/pretAPorter/ceinture', itemgroup: 'ceinture' },
            { name: 'Maroquinerie', image: '/lovable-uploads/850ce6f3-3077-447e-a7d5-f634b4f1bf6c.png', url: '/category/pretAPorter/maroquinerie', itemgroup: 'maroquinerie' }
          ]
        }
      ]
    },
    accessoires: {
      title: 'Accessoires',
      image: '/lovable-uploads/d96e264c-4c78-436f-8046-7b929a4d5ce8.png',
      url: '/category/accessoires',
      sections: [
        {
          title: 'Collections',
          items: [
            { name: 'Cravates', image: '/lovable-uploads/47f47df0-faf6-4178-8ae1-526655f4230c.png', url: '/category/accessoires/cravate', itemgroup: 'cravate' },
            { name: 'Pochettes', image: '/lovable-uploads/850ce6f3-3077-447e-a7d5-f634b4f1bf6c.png', url: '/category/accessoires/pochette', itemgroup: 'pochette' },
            { name: 'Maroquinerie', image: '/lovable-uploads/d96e264c-4c78-436f-8046-7b929a4d5ce8.png', url: '/category/accessoires/maroquinerie', itemgroup: 'maroquinerie' },
            { name: 'Autres Accessoires', image: '/lovable-uploads/47f47df0-faf6-4178-8ae1-526655f4230c.png', url: '/category/accessoires/autre', itemgroup: 'autre' }
          ]
        }
      ]
    }
  };

  if (!isOpen || !activeCategory || !categories[activeCategory as keyof typeof categories]) {
    return null;
  }

  const category = categories[activeCategory as keyof typeof categories];

  return (
    <div 
      className="fixed top-[120px] left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-50 animate-fade-in"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Category Hero */}
          <div className="col-span-12 lg:col-span-4">
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 h-full">
              <div className="absolute inset-0 bg-black bg-opacity-5 rounded-xl"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-hm-sans">
                  {category.title}
                </h2>
                <p className="text-gray-600 text-sm mb-6 font-hm-sans">
                  Découvrez notre collection exclusive d'articles de haute qualité
                </p>
                <div className="aspect-square w-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <button 
                  onClick={() => {
                    navigate(category.url);
                    onClose();
                  }}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm font-hm-sans"
                >
                  Voir Toute la Collection
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Products Grid */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {category.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-hm-sans border-b border-gray-200 pb-2">
                    {section.title}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        className="group flex items-center gap-4 w-full p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm"
                        onClick={() => {
                          navigate(item.url);
                          onClose();
                        }}
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="font-medium text-gray-900 text-sm group-hover:text-black transition-colors font-hm-sans">
                            {item.name}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200 group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-hm-sans mb-4">
              Besoin d'aide pour trouver le produit parfait ?
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  navigate('/contact');
                  onClose();
                }}
                className="bg-white text-gray-900 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium font-hm-sans"
              >
                Contacter un Expert
              </button>
              <button 
                onClick={() => {
                  navigate('/');
                  onClose();
                }}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium font-hm-sans"
              >
                Voir Tous les Produits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDropdown;