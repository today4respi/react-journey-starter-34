import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SocialSidebar from '@/components/SocialSidebar';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

interface Product {
  id_product: string;
  reference_product: string;
  nom_product: string;
  img_product: string;
  img2_product?: string;
  img3_product?: string;
  img4_product?: string;
  description_product: string;
  type_product: string;
  category_product: string;
  itemgroup_product: string;
  price_product: string;
  qnty_product: string;
  color_product: string;
  status_product: string;
  discount_product?: string;
  createdate_product: string;
}

const Category = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category mapping
  const getCategoryInfo = () => {
    const categoryMap = {
      surMesure: {
        title: 'Sur Mesure',
        description: 'Collections sur mesure premium',
        typeFilter: 'sur mesure'
      },
      pretAPorter: {
        title: 'Prêt à Porter',
        description: 'Collections prêt à porter',
        typeFilter: 'prêt à porter'
      },
      accessoires: {
        title: 'Accessoires',
        description: 'Accessoires de luxe',
        typeFilter: 'accessoires'
      }
    };

    return categoryMap[category as keyof typeof categoryMap] || {
      title: 'Collection',
      description: 'Nos produits',
      typeFilter: ''
    };
  };

  const getSubcategoryInfo = () => {
    if (!subcategory) return null;

    const parts = subcategory.split('-');
    if (parts.length === 2) {
      const [categoryPart, itemGroup] = parts;
      return {
        categoryFilter: categoryPart === 'homme' ? 'homme' : categoryPart === 'femme' ? 'femme' : '',
        itemGroupFilter: itemGroup
      };
    }
    
    // For simple subcategories like 'chemise', 'tshirt', etc.
    return {
      categoryFilter: '',
      itemGroupFilter: subcategory
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://draminesaid.com/lucci/api/get_all_products.php');
        const result = await response.json();
        
        if (result.success) {
          let filteredProducts = result.data;
          const categoryInfo = getCategoryInfo();
          const subcategoryInfo = getSubcategoryInfo();

          // Filter by main category (type_product)
          if (categoryInfo.typeFilter) {
            filteredProducts = filteredProducts.filter((product: Product) => 
              product.type_product.toLowerCase() === categoryInfo.typeFilter.toLowerCase()
            );
          }

          // Filter by subcategory if exists
          if (subcategoryInfo) {
            if (subcategoryInfo.categoryFilter) {
              filteredProducts = filteredProducts.filter((product: Product) => 
                product.category_product.toLowerCase() === subcategoryInfo.categoryFilter.toLowerCase()
              );
            }
            
            if (subcategoryInfo.itemGroupFilter) {
              filteredProducts = filteredProducts.filter((product: Product) => 
                product.itemgroup_product.toLowerCase() === subcategoryInfo.itemGroupFilter.toLowerCase()
              );
            }
          }

          setProducts(filteredProducts);
        } else {
          setError('Erreur lors du chargement des produits');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  const categoryInfo = getCategoryInfo();
  const subcategoryInfo = getSubcategoryInfo();

  const getPageTitle = () => {
    if (subcategory) {
      const parts = subcategory.split('-');
      if (parts.length === 2) {
        const [categoryPart, itemGroup] = parts;
        const categoryLabel = categoryPart === 'homme' ? 'Homme' : categoryPart === 'femme' ? 'Femme' : categoryPart;
        return `${categoryLabel} - ${itemGroup.charAt(0).toUpperCase() + itemGroup.slice(1)}`;
      }
      return subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
    }
    return categoryInfo.title;
  };

  const getBreadcrumb = () => {
    const breadcrumbs = [
      { label: 'Accueil', path: '/' },
      { label: categoryInfo.title, path: `/category/${category}` }
    ];

    if (subcategory) {
      breadcrumbs.push({ 
        label: getPageTitle(), 
        path: `/category/${category}/${subcategory}` 
      });
    }

    return breadcrumbs;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-montserrat">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600 font-hm-sans">Chargement des produits...</p>
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
        <SocialSidebar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white font-montserrat">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-red-600 font-hm-sans mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
        <SocialSidebar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <Header />
      <main>
        {/* Header section */}
        <div className="bg-gray-50 border-b border-gray-200 pt-20">{/* Added pt-20 for header spacing */}
          <div className="container mx-auto px-4 py-8">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 font-hm-sans"
            >
              <ChevronLeft size={20} />
              Retour
            </button>

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-2 text-sm mb-6 font-hm-sans">{/* Added flex-wrap for mobile */}
              {getBreadcrumb().map((item, index) => (
                <React.Fragment key={item.path}>
                  {index > 0 && <span className="text-gray-400">/</span>}
                  <button
                    onClick={() => navigate(item.path)}
                    className={`hover:text-black transition-colors text-xs sm:text-sm ${
                      index === getBreadcrumb().length - 1 
                        ? 'text-black font-medium' 
                        : 'text-gray-600'
                    }`}
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </nav>

            {/* Page title */}
            <div className="text-center">{/* Page title section */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-black mb-4 font-hm-sans">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 font-hm-sans max-w-2xl mx-auto text-sm sm:text-base">
                {subcategory 
                  ? `Découvrez notre sélection de ${getPageTitle().toLowerCase()}`
                  : categoryInfo.description
                }
              </p>
            </div>
          </div>
        </div>
        {/* Products section */}
        <div className="container mx-auto px-4 py-8 sm:py-12">{/* Responsive padding */}
          {products.length > 0 ? (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <p className="text-gray-600 font-hm-sans text-sm sm:text-base">
                  {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
                </p>
              </div>
              {/* Products grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">{/* Responsive grid and gap */}
              {products.map((product) => {
                // Convert API product to ProductCard format
                const imageUrl = product.img_product.startsWith('uploads/') 
                  ? `https://draminesaid.com/lucci/api/${product.img_product}`
                  : product.img_product;
                
                const adaptedProduct = {
                  id: product.id_product,
                  name: product.nom_product,
                  price: parseFloat(product.price_product),
                  originalPrice: product.discount_product && parseFloat(product.discount_product) > 0 
                    ? parseFloat(product.price_product) 
                    : undefined,
                  image: imageUrl,
                  images: [
                    imageUrl,
                    product.img2_product ? `https://draminesaid.com/lucci/api/${product.img2_product}` : imageUrl,
                    product.img3_product ? `https://draminesaid.com/lucci/api/${product.img3_product}` : imageUrl,
                    product.img4_product ? `https://draminesaid.com/lucci/api/${product.img4_product}` : imageUrl
                  ].filter(Boolean),
                  category: product.type_product,
                  sizes: ['S', 'M', 'L', 'XL'], // Default sizes, you can enhance this later
                  colors: [product.color_product || 'Noir'],
                  isNew: false,
                  isOnSale: product.discount_product && parseFloat(product.discount_product) > 0,
                  description: product.description_product,
                  rating: 4.5, // Default rating
                  reviews: 12, // Default reviews
                  stock: parseInt(product.qnty_product) || 10
                };
                
                return <ProductCard key={product.id_product} product={adaptedProduct} />;
              })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto px-4">
                <div className="bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">{/* Responsive icon size */}
                  <Filter className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 font-hm-sans">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 font-hm-sans text-sm sm:text-base mb-4 sm:mb-6">{/* Responsive text and margin */}
                  Aucun produit ne correspond à cette catégorie pour le moment.
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="mt-4 sm:mt-6"
                >
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      <SocialSidebar />
    </div>
  );
};

export default Category;