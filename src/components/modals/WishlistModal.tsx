
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WishlistItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

const WishlistModal = ({ isOpen, onClose }: WishlistModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('lucci-wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
      }
    }
  }, [isOpen]);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('lucci-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Article retiré",
      description: "L'article a été retiré de votre liste de souhaits.",
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast({
      title: "Liste vidée",
      description: "Votre liste de souhaits a été vidée.",
    });
  };

  const addToBag = (item: WishlistItem) => {
    // This would typically add to cart/bag
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre panier.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-serif text-center flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-red-400" />
            Liste de Souhaits
          </DialogTitle>
          <p className="text-slate-300 text-center mt-2">
            Vos articles favoris vous attendent
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">
                Votre liste de souhaits est vide
              </h3>
              <p className="text-slate-400 mb-6">
                Découvrez nos collections et ajoutez vos articles préférés
              </p>
              <Button
                onClick={onClose}
                className="bg-white text-black hover:bg-gray-200 font-medium"
              >
                Découvrir nos collections
              </Button>
            </div>
          ) : (
            <>
              {/* Header with count and clear button */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {wishlistItems.length} article{wishlistItems.length > 1 ? 's' : ''}
                </h3>
                {wishlistItems.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearWishlist}
                    className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Vider la liste
                  </Button>
                )}
              </div>

              {/* Wishlist items grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800 border border-slate-600 rounded-lg p-4 group hover:bg-slate-750 transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-slate-400 text-xs text-center">
                            Image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-white group-hover:text-blue-200 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-sm text-slate-400 mb-1">{item.category}</p>
                        <p className="text-lg font-semibold text-white">{item.price}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => addToBag(item)}
                          className="bg-white text-black hover:bg-gray-200 h-8 px-3"
                        >
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          Ajouter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromWishlist(item.id)}
                          className="bg-transparent border-slate-600 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-400 h-8 px-3"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistModal;
