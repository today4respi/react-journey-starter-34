
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import { trackVisitor } from '@/utils/visitorTracking';
import CategoryProducts from '@/components/category/CategoryProducts';
import FilterBar, { FilterState } from '@/components/category/FilterBar';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

const CategoryPage = () => {
  const { t } = useTranslation(['products', 'allProducts']);
  const { category, subcategory } = useParams();
  const [searchParams] = useSearchParams();
  
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    itemGroups: [],
    sizes: [],
    priceSort: '',
    colors: [],
    categories: []
  });
  
  // Increased initial load and reduced loading threshold for faster loading
  const itemsPerLoad = 16; // Load more items at once
  const [currentIndex, setCurrentIndex] = useState(itemsPerLoad);

  // Extraire itemgroup depuis subcategory (ex: "homme-blazers" -> "blazers")
  const getItemGroup = (subcategory: string | undefined): string | undefined => {
    if (!subcategory) return undefined;
    
    // Gérer le pattern "gender-itemtype" en extrayant juste itemtype
    const parts = subcategory.split('-');
    if (parts.length === 2 && (parts[0] === 'homme' || parts[0] === 'femme')) {
      return parts[1]; // Retourner juste le type d'article (ex: "blazers")
    }
    
    // Pour d'autres patterns, retourner tel quel
    return subcategory;
  };

  useEffect(() => {
    trackVisitor(`Category: ${category}/${subcategory || 'all'}`);
    fetchProducts();
  }, [category, subcategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Construire l'URL de l'API avec les paramètres appropriés
      const apiUrl = new URL('https://draminesaid.com/lucci/api/get_products_by_category.php');
      if (category && category !== 'all') {
        apiUrl.searchParams.set('category', category);
      }
      
      // Extraire le vrai itemgroup depuis subcategory
      const itemGroup = getItemGroup(subcategory);
      if (itemGroup) {
        apiUrl.searchParams.set('subcategory', itemGroup);
      }
      
      // Obtenir tous les produits sans pagination pour le filtrage
      apiUrl.searchParams.set('limit', '1000');
      apiUrl.searchParams.set('offset', '0');
      
      console.log('Récupération des produits depuis:', apiUrl.toString());
      console.log('Subcategory originale:', subcategory, 'Itemgroup extrait:', itemGroup);
      
      const response = await fetch(apiUrl.toString());
      const result = await response.json();
      
      console.log('Réponse API:', result);
      
      if (result.success) {
        setAllProducts(result.data);
        setFilteredProducts(result.data);
        setDisplayedProducts(result.data.slice(0, itemsPerLoad));
        setCurrentIndex(itemsPerLoad);
        setTotal(result.data.length);
      } else {
        console.error('Erreur API:', result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Appliquer les filtres aux produits
  useEffect(() => {
    let filtered = [...allProducts];

    // Filtrer par groupes d'articles
    if (filters.itemGroups.length > 0) {
      filtered = filtered.filter(product => 
        filters.itemGroups.includes(product.itemgroup_product)
      );
    }

    // Filtrer par catégories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category_product)
      );
    }

    // Trier par prix
    if (filters.priceSort) {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price_product);
        const priceB = parseFloat(b.price_product);
        return filters.priceSort === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    setFilteredProducts(filtered);
    setDisplayedProducts(filtered.slice(0, itemsPerLoad));
    setCurrentIndex(itemsPerLoad);
    setTotal(filtered.length);
  }, [filters, allProducts]);

  // Charger plus de produits
  const loadMoreProducts = () => {
    console.log('Chargement de plus de produits, index actuel:', currentIndex);
    const nextIndex = currentIndex + itemsPerLoad;
    const newProducts = filteredProducts.slice(currentIndex, nextIndex);
    console.log('Nouveaux produits à ajouter:', newProducts.length);
    
    if (newProducts.length > 0) {
      setDisplayedProducts(prev => {
        const updated = [...prev, ...newProducts];
        console.log('Total des produits affichés:', updated.length);
        return updated;
      });
      setCurrentIndex(nextIndex);
    }
  };

  const hasMore = currentIndex < filteredProducts.length;
  console.log('A plus de produits?', hasMore, 'Index actuel:', currentIndex, 'Total filtré:', filteredProducts.length);

  // Utiliser le hook de défilement infini avec un seuil plus élevé pour un chargement plus rapide
  const { isFetching, isLoadingMore } = useInfiniteScroll({
    fetchMore: loadMoreProducts,
    hasMore,
    loading,
    threshold: 800 // Increased threshold so products load earlier
  });

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    console.log('Changement de filtres:', newFilters);
    setFilters(newFilters);
  };

  const getCategoryTitle = () => {
    if (!category) return '';
    
    // Handle "all" category specifically
    if (category === 'all') {
      return t('allProducts:title');
    }
    
    if (subcategory) {
      // First try direct subcategory translation
      const subcategoryKey = `${category}-${subcategory}`;
      const directTranslation = t(`products:${subcategoryKey}`, { defaultValue: null });
      if (directTranslation) {
        return directTranslation;
      }
      
      // Fallback to nested translation
      return t(`products:${category}.${subcategory}`, { 
        defaultValue: t(`products:categories.${category}`) 
      });
    }
    
    return t(`products:categories.${category}`);
  };

  const getCategoryDescription = () => {
    if (category === 'all') {
      return t('allProducts:description', { count: total });
    }
    
    return t('products:categoryDescription', { 
      category: getCategoryTitle(),
      count: total 
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 mb-6 tracking-wide">
              {getCategoryTitle()}
            </h1>
            <div className="w-12 md:w-16 h-px bg-slate-900 mx-auto mb-6"></div>
            <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
              {getCategoryDescription()}
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar 
            totalResults={total}
            onFilterChange={handleFilterChange}
          />

          {/* Products Grid */}
          <div className="relative">
            <CategoryProducts 
              products={displayedProducts}
              loading={loading}
              likedProducts={likedProducts}
              onToggleLike={toggleLike}
            />

            {/* Enhanced Loading Animation */}
            {isLoadingMore && hasMore && (
              <div className="flex flex-col items-center py-12 animate-fade-in">
                <div className="relative">
                  {/* Primary loader */}
                  <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                  {/* Secondary pulse effect */}
                  <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-slate-600 opacity-20"></div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-slate-600 font-medium">
                    Chargement de nouveaux produits...
                  </span>
                  <div className="mt-2 w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Smooth transition when approaching more content */}
            {!isLoadingMore && hasMore && displayedProducts.length > itemsPerLoad && (
              <div className="flex justify-center py-6 animate-fade-in">
                <div className="text-center">
                  <div className="w-12 h-px bg-slate-300 mx-auto mb-3"></div>
                  <p className="text-xs text-slate-400 font-light">
                    Continuez à faire défiler pour voir plus de produits
                  </p>
                </div>
              </div>
            )}

            {/* End of Products Indicator */}
            {!hasMore && displayedProducts.length > 0 && (
              <div className="flex justify-center py-12 animate-fade-in">
                <div className="text-center">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mb-6"></div>
                  <p className="text-sm text-slate-500 font-light">
                    Vous avez exploré toute notre collection
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {displayedProducts.length} produits affichés
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
