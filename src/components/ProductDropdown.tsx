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
      className="fixed top-[120px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 animate-fade-in"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 font-hm-sans border-b border-gray-100 pb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      className="group flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-md transition-all duration-200"
                      onClick={() => {
                        navigate(item.url);
                        onClose();
                      }}
                    >
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-900 text-sm group-hover:text-black transition-colors font-hm-sans">
                        {item.name}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 ml-auto transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Simple bottom section */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <button 
              onClick={() => {
                navigate(category.url);
                onClose();
              }}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium font-hm-sans"
            >
              Voir Toute la Collection {category.title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDropdown;